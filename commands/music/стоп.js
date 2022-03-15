const Command = require('../../class/Command')

class Stop extends Command {
    constructor(client) {
        super(client, {
            name: 'стоп',
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
        queue.destroy();
        let stopped = client.utils.embed('Остановлено.', undefined, user)
        return void interaction.followUp({ embeds: [stopped] });
    }
}

module.exports = Stop;