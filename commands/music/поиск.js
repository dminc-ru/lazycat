const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, message, args) => {
    let noChannel = new MessageEmbed()
        .setColor(`#b88fff`)
        .setTitle(`Ошибка`)
        .setDescription(`Вы не подключены к голосовому каналу.`)
        .setTimestamp()
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
    let notmyChannel = new MessageEmbed()
        .setColor(`#b88fff`)
        .setTitle(`Ошибка`)
        .setDescription(`Вы не подключены к моему голосовому каналу.`)
        .setTimestamp()
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
    let specifySong = new MessageEmbed()
        .setColor(`#b88fff`)
        .setTitle(`Ошибка`)
        .setDescription(`Укажите название.`)
        .setTimestamp()
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
    if (!message.member.voice.channel) return message.channel.send(noChannel);

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(notmyChannel);

    if (!args[0]) return message.channel.send(specifySong);

    client.player.play(message, args.join(" "));
};

module.exports.help = {
	name: "поиск",
	aliases: ["gjbcr"],
	permissions: ["member"],
	modules: ["music"]
}