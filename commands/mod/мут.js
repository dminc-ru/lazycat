const { MessageEmbed } = require("discord.js");
const ms = require("ms");
module.exports.run = async (client, interaction) => {
	try {
		try {
			var user = await client.users.fetch(interaction.member.user.id)
			var guild = await client.guilds.fetch(interaction.guildId)
			var member = await guild.members.fetch(interaction.member.user.id)
			var muteUser = interaction.options.getUser('участник');
			var muteUserClientResolve = await client.users.fetch(muteUser)
			var muteUserResolve = await guild.members.fetch(muteUser);
		} catch(error) {
			interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
		}
		let guilddb = await client.db.getGuild(interaction.guildId)
		if ( !member.hasPermission('MODERATE_MEMBERS') ) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
		}
		if (muteUserResolve.communicationDisabledUntilTimestamp == null) {
			return interaction.reply({content: `На этом сервере не установлена роль для мута. Обратитесь к администратору сервера.`, ephemeral: true})
		}
		let usernames = muteUserClientResolve.tag;
		if (muteUserResolve) {
			const memberPosition = muteUserResolve.roles.highest.position;
			const moderationPosition = member.roles.highest.position;
			if( !(moderationPosition > memberPosition) ) {
				return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
			}
		} else {
			return interaction.reply({content: `Пользователь не найден.`, ephemeral: true})
		}
		if (muteUser == interaction.member.user.id) {
			return interaction.reply({content: `Вы не можете замутить себя.`, ephemeral: true})
		}
		if (muteUser == client.user.id) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
		}
		if (interaction.options.getString('причина').length > 2) {
			var reason = interaction.options.getString('причина')
		} else {
			var reason = `не указана`;
		}
		const mutetime = ms(interaction.options.getString('время'));
		if (typeof mutetime === 'undefined') {
			return interaction.reply({content: `Неправильный формат времени.`, ephemeral: true})
		}
		try {
			muteUserResolve.communicationDisabledUntilTimestamp = Date.now() + mutetime
		} catch (error) {
			return interaction.reply({content: `Произошла ошибка. Обратитесь на сервер поддержки.`, ephemeral: true})
		}
		let muteSuccess = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Мут: успешно')
			.addField('Модератор', user.tag, true)
			.addField('Пользователь', usernames, true)
			.addField('Длительность', ms(mutetime, { long: true }))
			.addField('Причина:', reason, false)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		interaction.reply({embeds: [muteSuccess]})
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
					.setFooter(`${user.tag}`, user.displayAvatarURL({dynamic: true}));
				const channel = await guild.channels.fetch(guilddb.logmsg_channel);
				channel.send(muteMessage);
			}catch(error){
				client.db.changeGuild(interaction.guildId, 'logmsg_channel', '')
			}
		}
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
	}
}

module.exports.data = {
	name: "мут",
	permissions: ["member"],
	type: "interaction"
}