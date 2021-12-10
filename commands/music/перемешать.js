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
    let queueEmpty = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Очередь пуста.`)
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
    
    if (!message.member.voice.channel) return message.channel.send(noChannel);

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(notmyChannel);

    if (!client.player.getQueue(message)) return message.channel.send(queueEmpty);

    const success = client.player.shuffle(message);
    let shuffled = new MessageEmbed()
        .setColor(`#b88fff`)
        .setTitle(`Очередь перемешана (${client.player.getQueue(message).tracks.length} треков).`)
        .setTimestamp()
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
    if (success) message.channel.send(shuffled);
};

module.exports.help = {
	name: "перемешать",
	aliases: ["gthtvtifnm"],
	permissions: ["developer"],
	modules: ["music"]
}