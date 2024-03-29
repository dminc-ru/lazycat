const ms = require("ms");
const os = require('os');
const Command = require('../../class/Command')
class Lzping extends Command {
	constructor(client) {
		super(client, {
			name: 'lzping',
			permissions: ['tester'],
			type: 'message',
			enabled: true,
			guildOnly: false
		})
	}

	async run (client, message, args) {
		try {
			var busymem = (((os.totalmem()/(1024*1024*1024)).toFixed(2)) - ((os.freemem()/(1024*1024*1024).toFixed(2))))
			let pongEmbed = client.utils.embed('Lazy Cat: server information')
				.addField(`Пинг:`, `\`\`\`${Math.round(client.ws.ping)}мс\`\`\``, true)
				.addField(`Серверов в кэше:`, `\`\`\`${client.guilds.cache.size}\`\`\``, true)
				.addField(`Пользователей в кэше:`, `\`\`\`${client.users.cache.size}\`\`\``, true)
				.addField(`Аптайм:`, `\`\`\`${ms(client.uptime)}\`\`\``, true)
				.addField(`RAM:`, `\`\`\`${busymem.toFixed(2)}GB/${(os.totalmem()/(1024*1024*1024)).toFixed(2)}GB\`\`\``, true)
				.addField(`Скорость CPU`, `\`\`\`${(os.cpus()[0].speed / 1000).toFixed(2)} GHz\`\`\``, true)
				.addField(`Модель CPU:`, `\`\`\`${os.cpus()[0].model}\`\`\``, false)
			message.channel.send({embeds: [pongEmbed]});
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			message.channel.send({ content: `Произошла ошибка при выполнении команды.`})
		}
	}
}

module.exports = Lzping;