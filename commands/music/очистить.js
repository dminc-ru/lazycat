const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
    await interaction.deferReply();
    var user = client.users.cache.get(interaction.member.user.id)
    const queue = client.player.getQueue(interaction.guildId);
    let noMusic = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Очередь пуста.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    if (!queue) return void interaction.followUp({ embeds: [noMusic] });
        
    queue.clear();
    let cleared = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Очередь очищена.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    interaction.followUp({ embeds: [cleared] });
}

module.exports.data = {
    name: "очистить",
    permissions: ["tester"],
    type: "interaction"
}