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

    const track = client.player.nowPlaying(message);
    let nowPlaying = new MessageEmbed()
        .setColor(`#b88fff`)
        .setTitle(`Сейчас играет ${track.title}`)
        .addField(`Автор`, `${track.author}`, true)
        .addField(`Добавил`, `${track.requestedBy.username}`, true)
        .addField(`Плейлист YT`, `${track.fromPlaylist ? 'да' : 'нет'}`, true)
        .addField(`Просмотры`, `${track.views}`, true)
        .addField(`Громкость`, `${client.player.getQueue(message).volume}`, true)
        .addField(`Повтор`, `${client.player.getQueue(message).repeatMode ? 'вкл.' : 'выкл.'}`, true)
        .addField(`Таймлайн`, `${client.player.createProgressBar(message, { timecodes: true })}`, false)
        .setThumbnail(track.thumbnail)
        .setTimestamp()
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
    message.channel.send(nowPlaying);
};

module.exports.help = {
	name: "сейчас",
	aliases: ["ctqxfc"],
	permissions: ["member"],
	modules: ["music"]
}