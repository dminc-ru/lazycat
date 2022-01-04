const { MessageEmbed } = require ('discord.js')

module.exports.run = async (client, interaction) => {
    await interaction.deferReply();
    var user = client.users.cache.get(interaction.member.user.id)
    const queue = client.player.getQueue(interaction.guildId);
    let noMusic = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Очередь пуста.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });
    await queue.setFilters({
        bassboost: !queue.getFiltersEnabled().includes('bassboost'),
    });
    setTimeout(() => {
        let bass = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`Бассбуст ${queue.getFiltersEnabled().includes('bassboost') ? 'включён.' : 'выключен.'}.`)
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
        return void interaction.followUp({ embeds: [bass] });
    }, queue.options.bufferingTimeout);
}

module.exports.data = {
    name: 'басс',
    permissions: ["tester"],
    type: 'interaction'
}