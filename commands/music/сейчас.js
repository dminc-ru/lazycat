const Command = require('../../class/Command')

class Np extends Command {
    constructor(client) {
        super(client, {
            name: 'сейчас',
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
        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        let nowPlaying = client.utils.embed('Сейчас играет', `**${queue.current.title}** (\`${perc.progress == 'Infinity' ? 'Live' : perc.progress + '%'}\`)`, user)
            .setThumbnail(queue.current.thumbnail)
            .addField(`\u200b`, `${progress.replace(/ 0:00/g, ' ◉ LIVE')}`)
        return void interaction.followUp({ embeds: [nowPlaying] })
    }
}

module.exports = Np;