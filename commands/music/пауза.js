const Command = require('../../class/Command')

class Pause extends Command {
    constructor(client) {
        super(client, {
            name: 'пауза',
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
        let paused = queue.setPaused(true);
        if (!paused) {
           paused = queue.setPaused(false);
           let pausedEmbed = client.utils.embed(`${paused ? "Возобновлено." : "Произошла ошибка."}`, undefined, user);
           return void interaction.followUp({ embeds: [pausedEmbed] });
        } else {
            let pausedEmbed = client.utils.embed(`Приостановлено.`, undefined, user);
            return void interaction.followUp({ embeds: [pausedEmbed] });
        }
    }
}

module.exports = Pause;