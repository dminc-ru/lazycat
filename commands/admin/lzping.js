let Command = require('../../class/Command')
let os = require('os')
let ms = require('ms')
const { MessageEmbed } = require('discord.js')
class Lzping extends Command {
    constructor(client) {
        super({
            name: 'lzping',
            permissions: ['developer'],
            type: 'message',
            enabled: true,
            guildOnly: false
        })
    }
    async run (client, message, args) {
		try {
			let busymem = (os.totalmem()/(1024*1024*1024)).toFixed(2) - (os.freemem()/(1024*1024*1024)).toFixed(2)
			let pongEmbed = new MessageEmbed()
				.setTitle('Server ping')
				.addField('Пинг:', `\`\`\`${client.ws.ping}мс\`\`\``)
		}
        let ping = client.utils.embed(`Pong.`)
    }
}