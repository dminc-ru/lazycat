const Command = require('../../class/Command')

class Skip extends Command {
    constructor(client) {
        super(client, {
            name: 'скип',
            permissions: ['member'],
            type: 'interaction',
            enabled: true,
            guildOnly: true
        })
    }

    async run (client, interaction) {
        await interaction.deferReply();
        var user = client.users.cache.get(interaction.member.user.id)
        const count = interaction.options.getInteger('количество')
        const queue = client.player.getQueue(interaction.guildId);
        let noMusic = client.utils.embed('Очередь пуста.', undefined, user)
        if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });

        if (!count) {
            const success = queue.skip();
            let skipped = client.utils.embed(`${success ? `Трек пропущен.` : `Произошла ошибка.`}`, undefined, user)
            return void interaction.followUp({ embeds: [skipped] });
        } else {
            const trackIndex = count - 1;
            if (trackIndex > (queue.length - 1)) {
                return interaction.followUp({ content: `Чтобы очистить очередь, напишите /очистить` })
            }
            queue.jump(trackIndex);
            let skipped = client.utils.embed(`Пропущено ${count} тр.`, undefined, user)
            return void interaction.followUp({ embeds: [skipped] });
        }
    }
}

module.exports = Skip;