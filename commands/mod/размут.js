const Command = require('../../class/Command')
class Unmute extends Command {
	constructor(client) {
		super(client, {
			name: 'размут',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: true
		})
	}

	async run (client, interaction) {
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
			let unmuteSuccess = client.utils.embed('Размут: успешно', undefined, user)
				.addField('Модератор:', `<@${user.id}>`, true)
				.addField('Пользователь:', `<@${unMuteUserResolve.id}>`, true)
				.addField('Причина размута:', `${reason}`, false)
			interaction.reply({embeds: [unmuteSuccess]})
			let muteMessage = client.utils.embed('Размут: успешно', undefined, client.user)
				.addField(`Модератор:`,	`<@${user.id}>`, true)
				.addField('Пользователь:', `<@${unMuteUserResolve.id}>`, true)
				.addField(`Причина размута:`, `${reason}`, false)
			if(guilddb.logmsg_channel != ""){
				try {
					const channel = await guild.channels.fetch(guilddb.logmsg_channel);
					channel.send({ embeds: [muteMessage] });
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
}

module.exports = Unmute;