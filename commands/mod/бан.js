const { MessageEmbed } = require("discord.js");
const fs = require("fs");
let bans = require(`${process.env.PATHTOBASE}/bans.json`);
module.exports.run = async (client, interaction) => {
	try{
	let user = client.users.cache.get(interaction.member.user.id);
	let guild = client.guilds.cache.get(interaction.guild_id);
	let guilddb = await client.db.get(interaction.guild_id, 'guilds')
	let member = guild.members.cache.get(interaction.member.user.id);
	if(!member.hasPermission('BAN_MEMBERS'))
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `У вас недостаточно прав для выполнения этой команды.`
				}
			}
		});
	var banUser = interaction.data.options[0].value;
	var banUserResolve = guild.members.fetch(banUser);
	if(!banUserResolve)
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Пользователь не найден.`
				}
			}
		});
			const memberPosition = banUserResolve.roles.highest.position;
			const moderationPosition = member.roles.highest.position;
			if(guild.owner.user.id != banUser && moderationPosition < memberPosition){
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
			if(!banUserResolve.bannable) {
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
	if(banUser == interaction.member.user.id)
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Вы не можете забанить себя.`
				}
			}
		});
	const banned = await guild.fetchBans();
		if(banned.some((m) => m.user.id === banUser)){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Пользователь уже забанен.`
					}
				}
			});
		}
	if(interaction.data.options.length > 1)
		var reason = interaction.data.options[1].value
	else
		var reason = `не указана`
	if(reason.length > 500) 
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Максимальное количество символов для причины — 500.`
				}
			}
		});
	let usernames = banUserResolve.tag;
	if(banUser == client.user.id)
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `У вас недостаточно прав для выполнения данного действия.`
				}
			}
		});
	try {
		banUserResolve.ban(reason);
	} catch (error) {
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Произошла ошибка при попытке бана. Возможно, у меня недостаточно прав для выполнения этого действия.`
				}
			}
		});
	}
	if(!bans[interaction.guild_id]){
		bans[interaction.guild_id] = [];
	}
	bans[interaction.guild_id].push({
		discordserverid: interaction.guild_id,
		moderatorid: interaction.member.user.id,
		moderatortag: user.tag,
		memberid: banUser,
		membertag: banUserResolve.tag,
		reason: reason,
		banCreatedAt: Date.now()
	});
	fs.writeFileSync(`${process.env.PATHTOBASE}/bans.json`, JSON.stringify(bans, null, "\t"));
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Бан: успешно',
							fields: [
								{
									name: "Модератор:",
									value: `${user.tag}`,
									inline: true
								},
								{
									name: "Пользователь:",
									value: `${banUserResolve.tag}`,
									inline: true
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
			let banMessage = new MessageEmbed()
				.setColor("#b88fff")
				.setTitle(`Бан: успешно`)
				.addField(`Модератор:`, `${user.tag}`, true)
				.addField(`Пользователь:`, `${banUserResolve.tag}`, true)
				.addField(`Причина:`, `${reason}`, false)
				.setTimestamp()
				.setFooter(`${user.tag}`, user.avatarURL())
			const channel = guild.channels.fetch(guilddb.logmsg_channel);
			channel.send(banMessage);
		}catch(error){
			client.db.change(interaction.guild_id, 'guilds', 'logmsg_channel', '')
		}
	}

	}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "бан",
	aliases: [",fy"],
	permissions: ["member"],
	modules: ["mod"]
}