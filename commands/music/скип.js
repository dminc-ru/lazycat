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
        if(client.player.getQueue(message).repeatMode){
            client.player.setRepeatMode(message, false);
            setTimeout(() => {
                client.player.skip(message);
            }, 1000)
            setTimeout(() => {
                if(client.player.getQueue(message)){
                    client.player.setRepeatMode(message, true);
                }
            }, 2000)
            let skipped = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Трек пропущен.`)
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
            setTimeout(() => {
                    if (success) return message.channel.send(skipped);
                }, 3000);
            
        }else{
            var success = client.player.skip(message); 
            let skipped = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Трек пропущен.`)
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
            if (success) return message.channel.send(skipped);
        }
};

module.exports.help = {
	name: "скип",
	aliases: ["crbg"],
	permissions: ["member"],
	modules: ["music"]
}