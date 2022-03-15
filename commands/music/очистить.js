const Command = require('../../class/Command')

class Clear extends Command {
    constructor(client) {
        super(client, {
            name: 'очистить',
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
        let noMusic = client.utils.embed('Очередь пуста', undefined, user)
        if (!queue) return void interaction.followUp({ embeds: [noMusic] });
            
        queue.clear();
        let cleared = client.utils.embed('Очередь очищена.', undefined, user)
        interaction.followUp({ embeds: [cleared] });
    }
}

module.exports = Clear;