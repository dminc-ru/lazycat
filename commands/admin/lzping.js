const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const os = require('os');
let stats = require(`${process.env.PATHTOBASE}/stats.json`);
module.exports.run = async (client, message, args) => {
try{
	var busymem = os.totalmem() - os.freemem()
	let pongEmbed = new MessageEmbed()
			.setColor("#b88fff")
			.setTitle(`Lazy Cat: server information`)
			.addField(`Пинг:`, `\`\`\`${Math.round(client.ws.ping)}ms\`\`\``, true)
			.addField(`Серверов:`, `\`\`\`${client.guilds.cache.size}\`\`\``, true)
			.addField(`Аптайм:`, `\`\`\`${ms(client.uptime)}\`\`\``, true)
			.addField(`RAM:`, `\`\`\`${(busymem/1000000000).toFixed(1)}GB/${(os.totalmem()/1000000000).toFixed(1)}GB\`\`\``, true)
			.addField(`Скорость CPU`, `\`\`\`${(os.cpus()[0].speed / 1000).toFixed(2)} GHz\`\`\``, true)
			.addField(`Модель CPU:`, `\`\`\`${os.cpus()[0].model}\`\`\``, false)
			.setTimestamp()
			.setFooter(`${stats.version}`, client.user.avatarURL());
    message.channel.send(pongEmbed);
}catch(error){
			client.logger.log(`${error}`, "err")
			console.log(error)
		}
}

module.exports.help = {
	name: "lzping",
	aliases: [],
	permissions: ["tester"],
	modules: ["admin"]
}