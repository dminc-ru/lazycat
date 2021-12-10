const { MessageEmbed } = require("discord.js");
let fs = require('fs');
let mutes = require(`${process.env.PATHTOBASE}/mutes.json`)
module.exports.run = async (client, interaction) => {
try{
	if(!mutes[interaction.guild_id])
		mutes[interaction.guild_id] = [];
	let user = client.users.cache.get(interaction.member.user.id);
	let guild = client.guilds.cache.get(interaction.guild_id);
	let guilddb = await client.db.get(interaction.guild_id, 'guilds')
	let member = guild.members.cache.get(interaction.member.user.id);
	var unMuteUser = interaction.data.options[0].value;
	var unMuteUserResolve = guild.members.cache.get(unMuteUser);
	if(!member.hasPermission('MANAGE_MESSAGES'))
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `У вас недостаточно прав для выполнения этого действия.`
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
	if(!unMuteUserResolve){
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
	if(unMuteUser == interaction.member.user.id)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `Вы не можете размутить себя.`
			}
		}
	});
	let checkMute = mutes[interaction.guild_id].find(obj => obj.memberid == unMuteUser);
	if(!unMuteUserResolve.roles.cache.has(guilddb.muteRole) || !checkMute){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Пользователь не замьючен.`
				}
			}
		});
	}
    if(interaction.data.options.length > 1)
		var reason = interaction.data.options[1].value
	else
		var reason = `не указана`;
	const role = guilddb.muteRole;
	 try {unMuteUserResolve.roles.remove(role);}catch (error) {
		console.log(error);
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Произошла ошибка при попытке убрать роль. Возможно, у меня недостаточно прав для этого действия.`
				}
			}
		});
	 }
	 var getMute = mutes[interaction.guild_id].find(mute => mute.memberid == unMuteUser);
	 client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: 'Размут: успешно',
						fields: [
							{
								name: "Модератор:",
								value: `${getMute.moderatortag}`,
								inline: true
							},
							{
								name: "Пользователь:",
								value: `${getMute.membertag}`,
								inline: true
							},
							{
								name: "Причина:",
								value: `${getMute.reason}`,
								inline: false
							},
							{
								name: "Размутил:",
								value: `${user.tag}`,
								inline: true
							},
							{
								name: "Причина размута:",
								value: `${reason}`,
								inline: true
							}
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
	var getMute = mutes[interaction.guild_id].find(mute => mute.memberid == unMuteUser);
	mutes[interaction.guild_id].splice(checkMute, 1);
	fs.writeFileSync(`${process.env.PATHTOBASE}/mutes.json`, JSON.stringify(mutes, null, "\t"));
	let muteMessage = new MessageEmbed()
		.setColor(`#b88fff`)
		.setTitle("Размут: успешно")
		.addField(`Модератор:`, `${getMute.moderatortag}`, true)
		.addField('Пользователь:', `${getMute.membertag}`, true)
		.addField('Причина мута:', `${getMute.reason}`, false)
		.addField(`Размутил:`, `${user.tag}`, true)
		.addField(`Причина размута:`, `${reason}`, true)
		.setTimestamp()
		.setFooter(`Lazy Cat`, client.user.displayAvatarURL());
	if(guilddb.logmsg_channel != ""){
		const channel = guild.channels.cache.get(guilddb.logmsg_channel);
		channel.send(muteMessage);
	}

}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "размут",
	aliases: ["hfpven"],
	permissions: ["member"],
	modules: ["mod"]
}