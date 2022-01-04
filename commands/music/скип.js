const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, interaction) => {
    await interaction.deferReply();
    var user = client.users.cache.get(interaction.member.user.id)
    const count = interaction.options.getInteger('количество')
    const queue = client.player.getQueue(interaction.guildId);
    let noMusic = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Очередь пуста.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    if (!queue || !queue.playing) return void interaction.followUp({ embeds: [noMusic] });

    if (!count) {
        const success = queue.skip();
        let skipped = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`${success ? `Трек пропущен.` : `Произошла ошибка.`}`)
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
        return void interaction.followUp({ embeds: [skipped] });
    } else {
        const trackIndex = count - 1;
        queue.jump(trackIndex);
        let skipped = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`Пропущено ${count} тр.`)
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
        return void interaction.followUp({ embeds: [skipped] });
    }
}