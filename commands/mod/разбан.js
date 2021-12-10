const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, interaction) => {
try{
	let user = client.users.cache.get(interaction.member.user.id);
	let guild = client.guilds.cache.get(interaction.guild_id);
	let guilddb = await client.db.get(interaction.guild_id, 'guilds')
	let member = guild.members.cache.get(interaction.member.user.id);
	let toUnban = interaction.data.options[0].value;
	var toUnbanClientResolve = client.users.cache.get(toUnban);
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
		const banList = await guild.fetchBans();
		var bannedUser = banList.find(us => us.user.id === toUnban);
		if(!bannedUser){
			bannedUser = banList.find(us => us.user.tag === toUnban);
			if(!bannedUser){
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
		}
		try {guild.members.unban(bannedUser.user.id, {reason});}catch (error) {return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Произошла ошибка при попытке разбана. Возможно, у меня недостаточно прав для выполнения этого действия.`
				}
			}
		});}
	if(interaction.data.options.length > 1)
		var reason = interaction.data.options[1].value
	else
		var reason = `не указана`;
	if(toUnban == interaction.member.user.id){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Вы не можете разбанить себя.`
				}
			}
		});
	}
	if(toUnban == client.user.id)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `У вас недостаточно прав для выполнения данного действия.`
			}
		}
	});
	let usernames = toUnbanClientResolve.tag;
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
		let banMessage = new MessageEmbed()
				.setColor("#b88fff")
				.setTitle(`Разбан: успешно`)
				.addField(`Модератор:`, `${user.tag}`, true)
				.addField(`Пользователь:`, `${usernames}`, true)
				.addField(`Причина:`, `${reason}`, false)
				.setTimestamp()
				.setFooter(`${user.tag}`, user.avatarURL())
		const channel = guild.channels.cache.get(guilddb.logmsg_channel);
		channel.send(banMessage);
		}catch(error){
			return client.db.change(interaction.guild_id, 'guilds', 'logmsg_channel', '')
		}
	}

}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "разбан",
	aliases: ["hfp,fy"],
	permissions: ["member"],
	modules: ["mod"]
}