const Command = require('../../class/Command')

class Volume extends Command {
    constructor(client) {
        super(client, {
            name: 'громкость',
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
        const vol = interaction.options.getInteger('уровень')
        let curLevel = client.utils.embed(`Текущая громкость: ${queue.volume}%`, undefined, user)
        if (!vol) return void interaction.followUp({ embeds: [curLevel] });
        let notInRange = client.utils.embed(`Громкость должна быть на уровне от 0 до 200%`, undefined, user)
        if (vol < 0 || vol > 200) return void interaction.followUp({ embeds: [notInRange] });
        const success = queue.setVolume(vol);
        let set = client.utils.embed(`Громкость установлена. (${vol}%)`, undefined, user)
        return void interaction.followUp({ embeds: [set] });
    }
}

module.exports = Volume;