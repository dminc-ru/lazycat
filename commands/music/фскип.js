const { MessageEmbed } = require("discord.js");

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
    const trackIndex = interaction.options.getInteger('номер') - 1;
    const trackName = queue.tracks[trackIndex].title;
    queue.remove(trackIndex);
    let removed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Трек удалён.')
        .addField(`Трек`, `${trackName}`, false)
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    interaction.followUp({ embeds: [removed] });
}

module.exports.data = {
    name: "фскип",
    permissions: ["tester"],
    type: "interaction"
}