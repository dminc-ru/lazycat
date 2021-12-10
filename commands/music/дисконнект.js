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
			.setTitle(`Отключён.`)
			.setTimestamp()
			.setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        let queueClear = new MessageEmbed()
            .setColor(`#b88fff`)
            .setTitle(`Отключён.`)
            .setTimestamp()
            .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        if (!message.member.voice.channel) return message.channel.send(noChannel);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(notmyChannel);

        if (!client.player.getQueue(message)){
            message.guild.me.voice.channel.leave();
            return message.channel.send(queueEmpty);
        }

        client.player.clearQueue(message);
        message.guild.me.voice.channel.leave();
        message.channel.send(queueClear);
};

module.exports.help = {
	name: "дисконнект",
	aliases: ["lbcrjyytrn", "rsi", "кыш"],
	permissions: ["member"],
	modules: ["music"]
}