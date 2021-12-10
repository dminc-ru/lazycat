const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, interaction) => {
try{
	let user = client.users.cache.get(interaction.member.user.id);
	let guild = client.guilds.cache.get(interaction.guild_id);
	let guilddb = await client.db.get(interaction.guild_id, 'guilds')
	let member = guild.members.cache.get(interaction.member.user.id);
	let toKick = interaction.data.options[0].value;
	let toKickClientResolve = client.users.cache.get(toKick);
	if(!member.hasPermission('KICK_MEMBERS'))
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `У вас недостаточно прав для выполнения этой команды.`
			}
		}
	});
	var toKickResolve = guild.members.cache.get(toKick);
	if(toKickResolve){
		const memberPosition = toKickResolve.roles.highest.position;
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
		if(!toKickResolve.kickable) {
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
	if(toKick == interaction.member.user.id)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `Вы не можете кикнуть себя.`
			}
		}
	});
	if(toKick == client.user.id)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `У вас недостаточно прав для выполнения данного действия.`
			}
		}
	});
    if(interaction.data.options.length > 1)
		var reason = interaction.data.options[1].value
	else
		var reason = `не указана`;
	try{guild.members.kick(toKick, {reason});}catch(error){
		console.log(error)
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Произошла ошибка при попытке кика. Возможно, у меня недостаточно прав для выполнения этого действия.`
				}
			}
		});
	}
	let usernames = toKickClientResolve.tag;
	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: 'Разбан: успешно',
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
			const channel = guild.channels.cache.get(guilddb.logmsg_channel);
			let muteMessage = new MessageEmbed()
			.setColor(`#b88fff`)
			.setTitle("Кик: успешно")
			.addField('Модератор:', `${user.tag}`, true)
			.addField('Пользователь:', `${usernames}`, true)
			.addField('Причина:', `${reason}`, false)
			.setTimestamp()
			.setFooter(`${user.tag}`, user.displayAvatarURL());
			return channel.send(muteMessage);
		}catch(error){
			client.db.change(interaction.guild_id, 'guilds', 'logmsg_channel', '');
		}
	}

}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "кик",
	aliases: ["rbr"],
	permissions: ["member"],
	modules: ["mod"]
}