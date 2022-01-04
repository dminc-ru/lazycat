const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
    await interaction.deferReply();

    const queue = client.player.getQueue(interaction.guildId);
    let noMusic = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Очередь пуста.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });
    const paused = queue.setPaused(true);
    let paused = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle(`${paused ? `Приостановлено.` : `Произошла ошибка.`}`)
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    return void interaction.followUp({ embeds: [paused] });
}

module.exports.data = {
    name: "пауза",
    permissions: ["tester"],
    type: "interaction"
}