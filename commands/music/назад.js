const Command = require('../../class/Command')

class Back extends Command {
    constructor(client) {
        super(client, {
            name: 'назад',
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
        await queue.back();
        let prev = client.utils.success('Проигрываю предыдущий трек.', undefined, user)
        interaction.followUp({ embeds: [prev] });
    }
}

module.exports = Back;