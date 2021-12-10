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

        if (client.player.getQueue(message).paused){ 
                client.player.resume(message);
                let resumed = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Продолжаю проигрывание.`)
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(resumed);
        }

        const success = client.player.pause(message);
        let paused = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Приостановлено.`)
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        if (success) message.channel.send(paused);
    
};

module.exports.help = {
	name: "пауза",
	aliases: ["gfepf"],
	permissions: ["member"],
	modules: ["music"]
}