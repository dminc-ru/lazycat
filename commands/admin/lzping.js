const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const os = require('os');
module.exports.run = async (client, message, args) => {
	let stats = require(`${client.config.jsonPath}stats.json`);
	var busymem = os.totalmem() - os.freemem()
	let pongEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`Lazy Cat: server information`)
			.addField(`Пинг:`, `\`\`\`${Math.round(client.ws.ping)}ms\`\`\``, true)
			.addField(`Серверов:`, `\`\`\`${client.guilds.cache.size}\`\`\``, true)
			.addField(`Аптайм:`, `\`\`\`${ms(client.uptime)}\`\`\``, true)
			.addField(`RAM:`, `\`\`\`${(busymem/ (1024*1024*1024) ).toFixed(1)}GB/${(os.totalmem()/(1024*1024*1024)).toFixed(1)}GB\`\`\``, true)
			.addField(`Скорость CPU`, `\`\`\`${(os.cpus()[0].speed / 1000).toFixed(2)} GHz\`\`\``, true)
			.addField(`Модель CPU:`, `\`\`\`${os.cpus()[0].model}\`\`\``, false)
			.setTimestamp()
			.setFooter(`${stats.version}`, client.user.avatarURL());
    message.channel.send(pongEmbed);
}
module.exports.data = {
	name: "lzping",
	permissions: ["tester"],
	type: "message"
}