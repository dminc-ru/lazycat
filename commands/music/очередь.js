const Command = require('../../class/Command')

class Queue extends Command {
    constructor(client) {
        super(client, {
            name: 'очередь',
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
        var page = interaction.options.getInteger('страница')
        let noMusic = client.utils.embed('Очередь пуста.', undefined, user)
        if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });
        if (!page) page = 1;
        const pageStart = 10 * (page - 1);
        const pageEnd = pageStart + 10;
        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
            return `${i + pageStart + 1}. **${m.title}** ([ссылка](${m.url}))`;
        });
        let queueEmbed = client.utils.embed('Очередь', `${tracks.join('\n')}${
                queue.tracks.length > pageEnd
                    ? `\n...и ещё ${queue.tracks.length - pageEnd} тр.`
                    : ''
            }`, user)
            .addField(`Сейчас играет`, `${currentTrack.title} ([ссылка](${currentTrack.url}))`)
        return void interaction.followUp({ embeds: [queueEmbed] })
    }
}

module.exports = Queue;