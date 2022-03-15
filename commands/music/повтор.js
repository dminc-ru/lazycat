const { QueueRepeatMode } = require("discord-player");
const Command = require('../../class/Command')

class Repeat extends Command {
    constructor(client) {
        super(client, {
            name: 'повтор',
            permissions: ['member'],
            type: 'interaction',
            enabled: true,
            guildOnly: true
        })
    }

    async run (client, interaction) {
        await interaction.deferReply();
        var user = client.users.cache.get(interaction.member.user.id)
        const queue = client.player.getQueue(interaction.guildId);
        let noMusic = client.utils.embed('Очередь пуста.', undefined, user)
        if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });
        var loopMode = interaction.options.getString('режим')
        if (loopMode == 'off')
            loopMode = QueueRepeatMode.OFF
        else if (loopMode == 'track')
            loopMode = QueueRepeatMode.TRACK
        else if (loopMode == 'queue')
            loopMode = QueueRepeatMode.QUEUE
        else if (loopMode == 'auto')
            loopMode = QueueRepeatMode.AUTOPLAY
        const success = queue.setRepeatMode(loopMode);
        let repeatSet = client.utils.embed(`${(loopMode == 'off') ? `Повтор выключен.` : ((loopMode == 'track') ? `Повтор трека включён.` : ((loopMode == 'queue') ? `Повтор очереди включён.` : `Автопроигрывание включено.`))}`, undefined, user)
        return void interaction.followUp({ embeds: [repeatSet] });
    }
}

module.exports = Repeat;