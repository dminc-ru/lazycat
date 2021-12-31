const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const os = require('os');
module.exports.run = async (client, message, args) => {
	try {
		let stats = require(`${client.config.jsonPath}stats.json`);
		var busymem = (((os.totalmem()/(1024*1024*1024)).toFixed(2)) - ((os.freemem()/(1024*1024*1024).toFixed(2))))
		let pongEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`Lazy Cat: server information`)
			.addField(`Пинг:`, `\`\`\`${Math.round(client.ws.ping)}мс\`\`\``, true)
			.addField(`Серверов в кэше:`, `\`\`\`${client.guilds.cache.size}\`\`\``, true)
			.addField(`Пользователей в кэше:`, `\`\`\`${client.users.cache.size}\`\`\``, true)
			.addField(`Аптайм:`, `\`\`\`${ms(client.uptime)}\`\`\``, true)
			.addField(`RAM:`, `\`\`\`${busymem.toFixed(2)}GB/${(os.totalmem()/(1024*1024*1024)).toFixed(2)}GB\`\`\``, true)
			.addField(`Скорость CPU`, `\`\`\`${(os.cpus()[0].speed / 1000).toFixed(2)} GHz\`\`\``, true)
			.addField(`Модель CPU:`, `\`\`\`${os.cpus()[0].model}\`\`\``, false)
			.setTimestamp()
			.setFooter({ text: `${stats.version}`, iconURL: client.user.avatarURL() });
		message.channel.send({embeds: [pongEmbed]});
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
		message.channel.send(`Произошла ошибка при выполнении команды.`)
	}
}
module.exports.data = {
	name: "lzping",
	permissions: ["tester"],
	type: "message"
}