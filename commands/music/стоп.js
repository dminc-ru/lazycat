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
    if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });
    queue.destroy();
    let stopped = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Остановлено.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    return void interaction.followUp({ embeds: [stopped] });
}

module.exports.data = {
    name: "стоп",
    permissions: ["tester"],
    type: "interaction"
}