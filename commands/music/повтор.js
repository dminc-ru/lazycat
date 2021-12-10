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

        if (args.join(" ").toLowerCase() === 'очередь') {
            if (client.player.getQueue(message).loopMode) {
                client.player.setLoopMode(message, false);
                let loopDisabled = new MessageEmbed()
                    .setColor(`#b88fff`)
                    .setTitle(`Повтор очереди отключён.`)
                    .setTimestamp()
                    .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(loopDisabled);
            } else {
                client.player.setLoopMode(message, true);
                let loopEnabled = new MessageEmbed()
                    .setColor(`#b88fff`)
                    .setTitle(`Повтор очереди включён.`)
                    .setTimestamp()
                    .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(loopEnabled);
            };
        } else {
            if (client.player.getQueue(message).repeatMode) {
                client.player.setRepeatMode(message, false);
                let loopDisabled = new MessageEmbed()
                    .setColor(`#b88fff`)
                    .setTitle(`Повтор трека отключён.`)
                    .setTimestamp()
                    .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(loopDisabled);
            } else {
                client.player.setRepeatMode(message, true);
                let loopEnabled = new MessageEmbed()
                    .setColor(`#b88fff`)
                    .setTitle(`Повтор трека включён.`)
                    .setTimestamp()
                    .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(loopEnabled);
            };
        };
};

module.exports.help = {
	name: "повтор",
	aliases: ["gjdnjh"],
	permissions: ["member"],
	modules: ["music"]
}