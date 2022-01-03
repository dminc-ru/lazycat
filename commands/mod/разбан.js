const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, interaction) => {
	try {
		try {
			var user = await client.users.fetch(interaction.member.user.id)
			var guild = await client.guilds.fetch(interaction.guildId)
			var member = await guild.members.fetch(interaction.member.user.id)
			var toUnban = interaction.options.getUser('участник');
			var toUnbanClientResolve = await client.users.fetch(toUnban);
		} catch(error) {
			return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
		}
		let guilddb = await client.db.getGuild(interaction.guildId)
		if( !member.permissions.has('BAN_MEMBERS') ) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
		}
		const banList = await guild.bans.fetch();
		var bannedUser = banList.find(us => us.user.id === toUnban);
		if (!bannedUser) {
			bannedUser = banList.find(us => us.user.tag === toUnban);
			if(!bannedUser){
				return interaction.reply({content: `Пользователь не найден.`, ephemeral: true})
			}
		}
		if (toUnban == interaction.member.user.id) {
			return interaction.reply({content: `Вы не можете разбанить себя.`, ephemeral: true})
		}
		if (toUnban == client.user.id) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения данного действия.`, ephemeral: true})
		}
		try {
			guild.bans.remove(bannedUser.user.id, `[ ${user.tag} ]: «${reason}»`);
		} catch (error) {
			return interaction.reply({content: `Произошла ошибка при попытке разбана. Возможно, у меня недостаточно прав для выполнения этого действия.`, ephemeral: true})
		}
		var reason = interaction.options.getString('причина')
		if (!reason) {
			var reason = `не указана`;
		}
		let usernames = toUnbanClientResolve.tag;
		let unbanSuccess = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Разбан: успешно')
			.addField('Модератор:', `<@${user.id}>`, true)
			.addField('Пользователь:', `${usernames}`, true)
			.addField('Причина:', `${reason}`, false)
			.setTimestamp()
			.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
		interaction.reply({embeds: [unbanSuccess]})
		if (guilddb.logmsg_channel != "") {
			try{
				let banMessage = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Разбан: успешно`)
					.addField(`Модератор:`, `<@${user.id}>`, true)
					.addField(`Пользователь:`, `${usernames}`, true)
					.addField(`Причина:`, `${reason}`, false)
					.setTimestamp()
					.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
				const channel = await guild.channels.fetch(guilddb.logmsg_channel);
				channel.send({ embeds: [banMessage] });
			}catch(error){
				return client.db.changeGuild(interaction.guildId, 'logmsg_channel', '')
			}
		}
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "разбан",
	permissions: ["member"],
	type: "interaction"
}