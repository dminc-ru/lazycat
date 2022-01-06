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
    const vol = interaction.options.getInteger('уровень')
    let curLevel = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle(`Текущая громкость: ${queue.volume}%`)
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    if (!vol) return void interaction.followUp({ embeds: [curLevel] });
    let notInRange = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle(`Громкость должна быть на уровне от 0 до 200%`)
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    if (vol < 0 || vol > 200) return void interaction.followUp({ embeds: [notInRange] });
    const success = queue.setVolume(vol);
    let set = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle(`Громкость установлена. (${vol}%)`)
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    return void interaction.followUp({ embeds: [set] });
}

module.exports.data = {
    name: "громкость",
    permissions: ["tester"],
    type: "interaction"
}