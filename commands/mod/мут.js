const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let mutes = require(`${process.env.PATHTOBASE}/mutes.json`);
module.exports.run = async (client, interaction) => {
try{
	if(!mutes[interaction.guild_id])
		mutes[interaction.guild_id] = [];
	let user = client.users.cache.get(interaction.member.user.id);
	let guild = client.guilds.cache.get(interaction.guild_id);
	let guilddb = await client.db.get(interaction.guild_id, 'guilds')
	let member = guild.members.cache.get(interaction.member.user.id);
	if(!member.hasPermission('MANAGE_MESSAGES'))
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `У вас недостаточно прав для выполнения этой команды.`
			}
		}
	});
	if(guilddb.muteRole == '')
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `На этом сервере не установлена роль для мута. Обратитесь к администратору сервера.`
			}
		}
	});
	var muteUser = interaction.data.options[0].value;
	var muteUserClientResolve = client.users.cache.get(interaction.data.options[0].value)
	var muteUserResolve = guild.members.cache.get(muteUser);
	let usernames = muteUserClientResolve.tag;
	if(muteUserResolve){
		const memberPosition = muteUserResolve.roles.highest.position;
		const moderationPosition = member.roles.highest.position;
		if(!(moderationPosition > memberPosition)){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `У вас недостаточно прав для выполнения этой команды.`
					}
				}
			});
		}
	}else{
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Пользователь не найден.`
				}
			}
		});
	}
	if(muteUser == interaction.member.user.id)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `Вы не можете замутить себя.`
			}
		}
	});
	if(muteUser == client.user.id)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `У вас недостаточно прав для выполнения этой команды.`
			}
		}
	});
	if(interaction.data.options.length > 2)
		var reason = interaction.data.options[2].value
	else
		var reason = `не указана`;
	const role = guilddb.muteRole;
    const mutetime = ms(interaction.data.options[1].value);
	if(mutetime < 60000){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Минимальное время мута — 1 минута.`
				}
			}
		});
	}
	if(mutetime > 1209600000){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Максимальное время мута — 14 дней.`
				}
			}
		});
	}
    if (typeof mutetime === 'undefined')
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `Неправильный формат времени.`
			}
		}
	});
	if (mutes[interaction.guild_id].find(us => us.memberid == muteUser)) 
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `Пользователь уже замьючен.`
			}
		}
	});
	 try {muteUserResolve.roles.add(role, {reason});}catch (error) {
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Произошла ошибка при попытке мута. Возможно, у меня недостаточно прав для выполнения этого действия.`
				}
			}
		});
	 }
	mutes[interaction.guild_id].push({
		discordserverid: interaction.guild_id,
		moderatorid: interaction.member.user.id,
		moderatortag: user.tag,
		memberid: muteUser,
		membertag: muteUserClientResolve.tag,
		reason: reason,
		roleid: role.id,
		muteCreatedAt: Date.now(),
		muteEndDate: Date.now() + mutetime
	});
	fs.writeFileSync(`${process.env.PATHTOBASE}/mutes.json`, JSON.stringify(mutes, null, "\t"));
	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: 'Мут: успешно',
						fields: [
							{
								name: "Модератор:",
								value: `${user.tag}`,
								inline: true
							},
							{
								name: "Пользователь:",
								value: `${usernames}`,
								inline: true
							},
							{
								name: "Длительность:",
								value: `${ms(mutetime, {long: true})}`,
								inline: false
							},
							{
								name: "Причина:",
								value: `${reason}`,
								inline: false
							},
						],
						timestamp: new Date(),
						footer: {
							text: `${user.tag}`,
							icon_url: `${user.displayAvatarURL()}`,
						}
					}
				]
			}
		}
	});
	if(guilddb.logmsg_channel != ""){
		try{
			let muteMessage = new MessageEmbed()
				.setColor(`#b88fff`)
				.setTitle("Мут: успешно")
				.addField('Модератор:', `${user.tag}`, true)
				.addField('Пользователь:', `${muteUserClientResolve.tag}`, true)
				.addField('Длительность:', `${ms(mutetime, {long: true})}`, false)
				.addField('Причина:', `${reason}`, false)
				.setTimestamp()
				.setFooter(`${user.tag}`, user.displayAvatarURL());
			const channel = guild.channels.cache.get(guilddb.logmsg_channel);
			channel.send(muteMessage);
		}catch(error){
			client.db.change(interaction.guild_id, 'guilds', 'logmsg_channel', '')
		}
	}
}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "мут",
	aliases: ["ven"],
	permissions: ["member"],
	modules: ["mod"]
}