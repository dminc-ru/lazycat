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

    const queue = client.player.getQueue(message);

    if (!client.player.getQueue(message)) return message.channel.send(queueEmpty);
    let toOutput = [];
    if(queue.tracks.length > 5){
        for (var i = 0; i < queue.tracks.length; i++) {
            if(i < 5){
                toOutput.push(`${i + 1}. ${queue.tracks[i].title} (добавлен: ${queue.tracks[i].requestedBy.username})\n`);
            }else{
                function declOfNum(n, text_forms) {  
                    n = Math.abs(n) % 100; var n1 = n % 10;
                    if (n > 10 && n < 20) { return text_forms[2]; }
                    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
                    if (n1 == 1) { return text_forms[0]; }
                    return text_forms[2];
                }
                let last = queue.tracks.length - 5;
                toOutput.push(`и ещё ${last} ${declOfNum(last, ['трек', 'трека', 'треков'])}...`);
                break;
            }
        }
    }else{
        queue.tracks.map((track, i) => {
            toOutput.push(`${i + 1}. ${track.title} (добавлен: ${track.requestedBy.username})\n`);
        });
    }
    let nowqueue = new MessageEmbed()
        .setColor(`#b88fff`)
        .setTitle(`Очередь`)
        .setDescription(`**Сервер:** ${message.guild.name}\n**Повтор:** ${client.player.getQueue(message).loopMode ? 'включён' : 'выключен'}`)
        .addField(`Сейчас играет:`, `\`\`\`${queue.playing.title}\`\`\``, false)
        .addField('Треки:', `\`\`\`\n${toOutput.join("")}\n\`\`\``, false)
        .setTimestamp()
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
    message.channel.send(nowqueue);
};

module.exports.help = {
	name: "очередь",
	aliases: ["jxthtlm"],
	permissions: ["member"],
	modules: ["music"]
}