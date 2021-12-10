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

        client.player.setRepeatMode(message, false);
        const success = client.player.stop(message);
        let stopped = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Остановлено.`)
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        if (success) message.channel.send(stopped);
};

module.exports.help = {
	name: "стоп",
	aliases: ["cnjg"],
	permissions: ["member"],
	modules: ["music"]
}