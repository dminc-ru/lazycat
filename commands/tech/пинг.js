const ms = require("ms");
const Command = require('../../class/Command')

class Ping extends Command {
	constructor(client) {
		super(client, {
			name: 'пинг',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: true
		})
	}

	async run (client, interaction) {
		try {
			try {
				var user = await client.users.fetch(interaction.member.user.id);
			} catch(error) {
				return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
			}
			var members = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
			let pongEmbed = client.utils.embed('Понг!', `Задержка: **${Math.round(client.ws.ping)}**мс\n
					${client.emoji.cloud} Серверов: ${client.guilds.cache.size}
					${client.emoji.users} Пользователей: ${members}
					${client.emoji.time} Аптайм: ${ms(client.uptime, {long: true})}`, user)
			interaction.reply({embeds: [pongEmbed]})
		} catch(error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Ping;