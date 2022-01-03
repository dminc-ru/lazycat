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
		if ( !member.permissions.has('MODERATE_MEMBERS') ) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
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
		var reason = interaction.options.getString('причина')
		if (!reason) {
			reason = `не указана`
		}
		var mutetime = ms(interaction.options.getString('время'));
		more = false;
		if (mutetime > 2419200000) {
			more = true
			mutetime = 2418199000
		}
		if (typeof mutetime === 'undefined') {
			return interaction.reply({content: `Неправильный формат времени.`, ephemeral: true})
		}
		try {
			muteUserResolve.edit({ communicationDisabledUntil: Date.now() + mutetime }, `[ ${user.tag} ]: «${reason}»`)
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			return interaction.reply({content: `Произошла ошибка. Обратитесь на сервер поддержки.`, ephemeral: true})
		}
		let muteSuccess = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Мут: успешно')
			.addField('Модератор', `<@${user.id}>`, true)
			.addField('Пользователь', `<@${muteUserClientResolve.id}>`, true)
			.addField('Длительность', `${ms(mutetime, { long: true })}`)
			.addField('Причина:', `${reason}`, false)
			.setTimestamp()
			.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
		await interaction.reply({embeds: [muteSuccess]})
		if (more) {
			interaction.followUp({content: `Максимальное время мута — 28 дней.`, ephemeral: true})
		}
		if(guilddb.logmsg_channel != ""){
			try{
				let muteMessage = new MessageEmbed()
					.setColor(`#b88fff`)
					.setTitle("Мут: успешно")
					.addField('Модератор:', `<@${user.id}>`, true)
					.addField('Пользователь:', `<@${muteUserClientResolve.id}>`, true)
					.addField('Длительность:', `${ms(mutetime, {long: true})}`, false)
					.addField('Причина:', `${reason}`, false)
					.setTimestamp()
					.setFooter({ text: `${user.tag}`, iconURL: user.displayAvatarURL({dynamic: true}) });
				const channel = await guild.channels.fetch(guilddb.logmsg_channel);
				channel.send({ embeds: [muteMessage] });
			}catch(error){
				client.db.changeGuild(interaction.guildId, 'logmsg_channel', '')
			}
		}
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "мут",
	permissions: ["member"],
	type: "interaction"
}