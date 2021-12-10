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
			.setTitle(`Очередь уже пуста.`)
			.setTimestamp()
			.setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        let queueClear = new MessageEmbed()
            .setColor(`#b88fff`)
            .setTitle(`Очередь очищена.`)
            .setTimestamp()
            .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        if (!message.member.voice.channel) return message.channel.send(noChannel);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(notmyChannel);

        if (!client.player.getQueue(message)) return message.channel.send(queueEmpty);

        if(args[0]) {
            if(!isNaN(args[0])){
                client.player.remove(message, (args[0] - 1));
                let trackClear = new MessageEmbed()
                    .setColor(`#b88fff`)
                    .setTitle(`Трек удалён из очереди.`)
                    .setTimestamp()
                    .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(trackClear);
            }
        }

        if(client.player.getQueue(message).repeatMode){
            client.player.setRepeatMode(message, false);
            setTimeout(() => {
                client.player.clearQueue(message);
            }, 1000)
            setTimeout(() => {
                return message.channel.send(queueClear);
            }, 2000);
            
        }else{
            client.player.clearQueue(message); 
                return message.channel.send(queueClear);
        }
};

module.exports.help = {
	name: "очистить",
	aliases: ["jxbcnbnm"],
	permissions: ["member"],
	modules: ["music"]
}