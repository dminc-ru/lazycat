const { QueueRepeatMode } = require("discord-player");

module.exports.run = async (client, interaction) => {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guildId);
    let noMusic = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Очередь пуста.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });
    const loopMode = interaction.options.getString('режим')
    if (loopMode == 'off')
        loopMode = QueueRepeatMode.OFF
    else if (loopMode == 'track')
        loopMode = QueueRepeatMode.TRACK
    else if (loopMode == 'queue')
        loopMode = QueueRepeatMode.QUEUE
    else if (loopMode == 'auto')
        loopMode = QueueRepeatMode.AUTOPLAY
    const success = queue.setRepeatMode(loopMode);
    let repeatSet = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Повтор включён.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    return void interaction.followUp({ embeds: [repeatSet] });
}

module.exports.data = {
    name: "повтор",
    permissions: ["tester"],
    type: "interaction"
}