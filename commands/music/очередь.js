const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, interaction) => {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guildId);
    var page = interaction.options.getInteger('страница')
    let noMusic = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Очередь пуста.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });
    if (!page) page = 1;
    const pageStart = 10 * (page - 1);
    const pageEnd = pageStart + 10;
    const currentTrack = queue.current;
    const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
        return `${i + pageStart + 1}. **${m.title}** ([ссылка](${m.url}))`;
    });
    let queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Очередь')
        .setDescription(`${tracks.join('\n')}${
            queue.tracks.length > pageEnd
                ? `\n...и ещё ${queue.tracks.length - pageEnd} тр.`
                : ''
        }`)
        .addField(`Сейчас играет`, `${currentTrack.title} ([ссылка](${currentTrack.url}))`)
    return void interaction.followUp({ embeds: [queueEmbed] })
}

module.exports.data = {
    name: "очередь",
    permissions: ["tester"],
    type: "interaction"
}