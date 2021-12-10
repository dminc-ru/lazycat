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
        let specifyVolume = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Укажите уровень громкости (1-150).`)
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        if (!message.member.voice.channel) return message.channel.send(noChannel);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(notmyChannel);

        if (!client.player.getQueue(message)) return message.channel.send(queueEmpty);

        if (!args[0] || isNaN(args[0]) || args[0] === 'Infinity') return message.channel.send(specifyVolume);

        if (Math.round(parseInt(args[0])) < 1 || Math.round(parseInt(args[0])) > 150) return message.channel.send(specifyVolume);

        const success = client.player.setVolume(message, parseInt(args[0]));
        let setted = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Громкость установлена на ${parseInt(args[0])}%`)
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        if (success) message.channel.send(setted);
};

module.exports.help = {
	name: "громкость",
	aliases: ["uhjvrjcnm"],
	permissions: ["member"],
	modules: ["music"]
}