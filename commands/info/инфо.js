const Command = require('../../class/Command')
class Info extends Command {
	constructor(client) {
		super(client, {
			name: 'инфо',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: false
		})
	}

	async run(client, interaction) {
		try {
			let stats = client.json.stats
			let noUser = client.utils.error('Пользователь не найден в базе данных.')
			try {
				var user = await client.users.fetch(interaction.member.user.id);
			} catch (error) {
				return message.channel.send({embeds: [noUser]})
			}
			let infoEmbed = client.utils.embed('Информация',
					`${client.emoji.b} Lazy Cat — играет музыку для вашего сервера Discord.
					${client.emoji.cloud} Серверов: **${client.guilds.cache.size}**
					${client.emoji.cmd} Команд обработано: **${stats.commands}**
	
					${client.emoji.ph} Версия продукта: **${stats.version}**
	
					Список доступных команд: **/помощь**
					[**Добавить на свой сервер**](${client.config.inviteLink})
	
					[Условия использования](${client.config.termsLink})
					[Политика конфиденциальности](${client.config.privacyLink})`, user)
			interaction.reply({embeds: [infoEmbed]})
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Info;