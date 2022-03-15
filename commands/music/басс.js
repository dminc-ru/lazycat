const Command = require('../../class/Command')
class Bass extends Command {
    constructor(client) {
        super(client, {
            name: 'басс',
            permissions: ['tester'],
            type: 'interaction',
            enabled: true,
            guildOnly: true
        })
    }

    async run (client, interaction)  {
        await interaction.deferReply();
        var user = client.users.cache.get(interaction.member.user.id)
        const queue = client.player.getQueue(interaction.guildId);
        let noMusic = client.utils.embed('Очередь пуста.', undefined, user)
        if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });
        await queue.setFilters({
            bassboost: !queue.getFiltersEnabled().includes('bassboost'),
        });
        setTimeout(() => {
            let bass = client.utils.embed(`Бассбуст ${queue.getFiltersEnabled().includes('bassboost') ? 'включён.' : 'выключен.'}.`, undefined, user)
            return void interaction.followUp({ embeds: [bass] });
        }, queue.options.bufferingTimeout);
    }
}

module.exports = Bass;