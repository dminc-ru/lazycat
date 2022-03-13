const Command = require('../../class/Command')
class Donate extends Command {
	constructor(client) {
		super(client, {
			name: 'донат',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: false
		})
	}
	
	async run (client, interaction) {
		try {
			let noUser = client.utils.error('Пользователь не найден в базе данных.')
			try {
				var user = await client.users.fetch(interaction.member.user.id);
			} catch (error) {
				return interaction.reply({embeds: [noUser], ephemeral: true})
			}
			let donateEmbed = client.utils.embed(`${client.emoji.heart} Донат`, `Здесь вы можете материально поддержать разработку Lazy Cat. Спасибо!`, user)
				.addField(`${client.emoji.da} Donation Alerts`, `[клик](${client.config.daLink})`)
			interaction.reply({embeds: [donateEmbed]})
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Donate;