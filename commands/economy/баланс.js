const Command = require('../../class/Command')
class Balance extends Command {
	constructor(client) {
		super(client, {
			name: 'баланс',
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
			let userdb = await client.db.getUser(interaction.member.user.id)
			let userProfile = client.utils.embed('Баланс', undefined, user)
				.setAuthor({name: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
				.addField(`Рыбки:`, `${userdb.balance_fish} ${client.emoji.fish}`, true)
				.addField(`Жучки:`, `${userdb.balance_bugs} ${client.emoji.bug}`, true)
				.addField(`В банке:`, `${userdb.balance_bank} ${client.emoji.fish}`, false)
			interaction.reply({embeds: [userProfile]})
		} catch(error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Balance;