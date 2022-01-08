const { MessageEmbed } = require("discord.js");

module.exports.registerPlayerEvents = (player) => {

    player.on("error", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });
    player.on("connectionError", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });

    player.on("trackStart", (queue, track) => {
        let trackStarted = new MessageEmbed()
            .setColor('#b88fff')
            .setTitle('Сейчас играет')
            .setThumbnail(track.thumbnail)
            .addField('Трек', `${track.title}`, false)
            .addField('Канал', `<#${queue.connection.channel.id}>`)
        queue.metadata.send({ embeds: [trackStarted] });
    });

    player.on("trackAdd", (queue, track) => {
        let trackQueued = new MessageEmbed()
            .setColor('#b88fff')
            .setTitle('Трек добавлен в очередь')
            .setThumbnail(track.thumbnail)
            .addField('Трек', `${track.title}`, false)
            .addField('Канал', `<#${queue.connection.channel.id}>`)
        queue.metadata.send({ embeds: [trackQueued] });
    });

    player.on("botDisconnect", (queue) => {
        let forceDisconnect = new MessageEmbed()
            .setColor('#b88fff')
            .setTitle('Отключён. Очередь очищена.')
        queue.metadata.send({ embeds: [forceDisconnect] });
    });

    player.on("channelEmpty", (queue) => {
        let channelEmpty = new MessageEmbed()
            .setColor('#b88fff')
            .setTitle('Канал пуст. Очередь очищена.')
        queue.metadata.send({ embeds: [channelEmpty] });
    });

    player.on("queueEnd", (queue) => {
        let queueEnd = new MessageEmbed()
            .setColor('#b88fff')
            .setTitle('Очередь закончилась.')
        queue.metadata.send({ embeds: [queueEnd] });
    });

};