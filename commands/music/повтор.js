const { QueueRepeatMode } = require("discord-player");
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
    var loopMode = interaction.options.getString('режим')
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
        .setTitle(`${(loopMode == 'off') ? `Повтор выключен.` : ((loopMode == 'track') ? `Повтор трека включён.` : ((loopMode == 'queue') ? `Повтор очереди включён.` : `Автопроигрывание включено.`))}Повтор включён.`)
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    return void interaction.followUp({ embeds: [repeatSet] });
}

module.exports.data = {
    name: "повтор",
    permissions: ["tester"],
    type: "interaction"
}