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
    if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });
    await queue.back();
    let prev = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Успешно')
        .setDescription('Проигрываю предыдущий трек.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    interaction.followUp({ embeds: [prev] });
}

module.exports.data = {
    name: 'назад',
    permissions: ["tester"],
    type: "interaction"
}