let Command = require('../../class/Command')

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
        let ping = client.utils.embed(`Pong.`)
    }
}