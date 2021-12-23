const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let guild = await client.guilds.fetch(interaction.guild_id);
	let guilddb = await client.db.getGuild(interaction.guild_id)
	let member = await guild.members.fetch(interaction.member.user.id);
	let toUnban = interaction.data.options[0].value;
	var toUnbanClientResolve = await client.users.fetch(toUnban);
	if( !member.hasPermission('BAN_MEMBERS') ) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	const banList = await guild.fetchBans();
	var bannedUser = banList.find(us => us.user.id === toUnban);
	if (!bannedUser) {
		bannedUser = banList.find(us => us.user.tag === toUnban);
		if(!bannedUser){
			return interaction.reply({content: `Пользователь не найден.`, ephemeral: true})
		}
	}
	try {
		guild.members.unban(bannedUser.user.id, {reason});
	} catch (error) {
		return interaction.reply({content: `Произошла ошибка при попытке разбана. Возможно, у меня недостаточно прав для выполнения этого действия.`, ephemeral: true})
	}
	if (interaction.data.options.length > 1) {
		var reason = interaction.data.options[1].value
	} else {
		var reason = `не указана`;
	}
	if (toUnban == interaction.member.user.id) {
		return interaction.reply({content: `Вы не можете разбанить себя.`, ephemeral: true})
	}
	if (toUnban == client.user.id) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения данного действия.`, ephemeral: true})
	}
	let usernames = toUnbanClientResolve.tag;
	let unbanSuccess = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Разбан: успешно')
		.addField('Модератор:', user.tag, true)
		.addField('Пользователь:', usernames, true)
		.addField('Причина:', reason, false)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	interaction.reply({embeds: [unbanSuccess]})
	if (guilddb.logmsg_channel != "") {
		try{
			let banMessage = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Разбан: успешно`)
				.addField(`Модератор:`, `${user.tag}`, true)
				.addField(`Пользователь:`, `${usernames}`, true)
				.addField(`Причина:`, `${reason}`, false)
				.setTimestamp()
				.setFooter(`${user.tag}`, user.displayAvatarURL({dynamic: true}))
			const channel = await guild.channels.fetch(guilddb.logmsg_channel);
			channel.send(banMessage);
		}catch(error){
			return client.db.changeGuild(interaction.guild_id, 'logmsg_channel', '')
		}
	}
}

module.exports.data = {
	name: "разбан",
	permissions: ["member"],
	type: "interaction"
}