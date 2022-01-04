module.exports.registerPlayerEvents = (player) => {

    player.on("error", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });
    player.on("connectionError", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });

    player.on("trackStart", (queue, track) => {
        queue.metadata.send(`Сейчас играет: **${track.title}** (<#${queue.connection.channel.id}>!`);
    });

    player.on("trackAdd", (queue, track) => {
        queue.metadata.send(`Трек **${track.title}** добавлен в очередь!`);
    });

    player.on("botDisconnect", (queue) => {
        queue.metadata.send("Я был отключён от голосового канала. Очередь очищена.");
    });

    player.on("channelEmpty", (queue) => {
        queue.metadata.send("Все участники покинули голосовой канал. Очередь очищена.");
    });

    player.on("queueEnd", (queue) => {
        queue.metadata.send("Очередь закончилась.");
    });

};