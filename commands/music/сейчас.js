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
    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    let nowPlaying = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Сейчас играет')
        .setDescription(`**${queue.current.title}** (\`${perc.progress == 'Infinity' ? 'Live' : perc.progress + '%'}\`)`)
        .addField(`\u200b`, `${progress.replace(/ 0:00/g, ' ◉ LIVE')}`)
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    return void interaction.followUp({ embeds: [nowPlaying] })
}
module.exports.data = {
    name: "сейчас",
    permissions: ["tester"],
    type: "interaction"
}