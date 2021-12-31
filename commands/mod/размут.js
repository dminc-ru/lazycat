const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, interaction) => {
	try {
		try {
			var user = await client.users.fetch(interaction.member.user.id)
			var guild = await client.guilds.fetch(interaction.guildId)
			var member = await guild.members.fetch(interaction.member.user.id)
			var unMuteUser = interaction.options.getUser('участник')
			var unMuteUserResolve = await guild.members.fetch(unMuteUser)
		} catch(error) {
			return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
		}
		let guilddb = await client.db.getGuild(interaction.guildId)
		if( !member.permissions.has('MODERATE_MEMBERS') ) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения этого действия.`, ephemeral: true})
		}
		if (unMuteUserResolve.communicationDisabledUntilTimestamp == null) {
			return interaction.reply({content: `Пользователь не замьючен.`, ephemeral: true})
		}
		if (!unMuteUserResolve) {
			return interaction.reply({content: `Пользователь не найден.`, ephemeral: true})
		}
		if (unMuteUser == interaction.member.user.id || unMuteUser == client.user.id) {
			return interaction.reply({content: `Недостаточно прав.`, ephemeral: true})
		}
		var reason = interaction.options.getString('причина')
		if (!reason) {
			var reason = `не указана`;
		}
		try {
			unMuteUserResolve.edit({ communicationDisabledUntil: null }, `[ ${user.tag} ]: «${reason}»`)
		} catch (error) {
			console.log(error);
			return interaction.reply({content: `Произошла ошибка. Обратитесь на сервер поддержки.`, ephemeral: true})
		}
		let unmuteSuccess = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Размут: успешно')
			.addField('Модератор:', user.tag, true)
			.addField('Пользователь:', unMuteUserResolve.tag, true)
			.addField('Причина размута:', reason, true)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		interaction.reply({embeds: [unmuteSuccess]})
		let muteMessage = new MessageEmbed()
			.setColor(`#b88fff`)
			.setTitle("Размут: успешно")
			.addField(`Модератор:`,	user.tag, true)
			.addField('Пользователь:', unMuteUserResolve.tag, true)
			.addField(`Причина размута:`, reason, true)
			.setTimestamp()
			.setFooter(`Lazy Cat`, client.user.displayAvatarURL({dynamic: true}));
		if(guilddb.logmsg_channel != ""){
			try {
				const channel = await guild.channels.fetch(guilddb.logmsg_channel);
				channel.send(muteMessage);
			} catch(error) {
				return
			}
		}
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "размут",
	permissions: ["member"],
	type: "interaction"
}