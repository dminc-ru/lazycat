const { MessageEmbed } = require("discord.js");
let playlists = require(`${process.env.PATHTOBASE}/playlists.json`);
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
        let specifyTitle = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Ошибка`)
                .setDescription(`Укажите название.`)
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        if (!message.member.voice.channel) return message.channel.send(noChannel);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(notmyChannel);

        if (!args[0]) return message.channel.send(specifyTitle);
		if (args[0] == 'рандом') {
                const queue = client.player.getQueue(message)
                if(!queue) {
                        let queueEmpty = new MessageEmbed()
                                .setColor(`#b88fff`)
                                .setTitle(`Очередь пуста.`)
                                .setTimestamp()
                                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                        return message.channel.send(queueEmpty);
                };
                if (queue.autoPlay == false) {
                        client.player.setAutoPlay(message, true)
                        let randomPlayEn = new MessageEmbed()
                                .setColor(`#b88fff`)
                                .setTitle(`Успешно`)
                                .setDescription(`Теперь вам будут проигрываться случайные треки.`)
                                .setTimestamp()
                                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                        return message.channel.send(randomPlayEn);
                }
                else {
                        client.player.setAutoPlay(message, false)
                        let randomPlayDis = new MessageEmbed()
                                .setColor(`#b88fff`)
                                .setTitle(`Успешно`)
                                .setDescription(`Случайное проигрывание отключено.`)
                                .setTimestamp()
                                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                        return message.channel.send(randomPlayDis);
                }

        }
        if (args[0] == 'лист') {
                if (!args[1]){
                        let specifyNum = new MessageEmbed()
                                .setColor(`#b88fff`)
                                .setTitle(`Ошибка`)
                                .setDescription(`Укажите номер плейлиста.`)
                                .setTimestamp()
                                .setFooter(`${message.author.tag} • /плейлист список`, message.author.displayAvatarURL());
                        return message.channel.send(specifyNum);
                }
                if (playlists[message.author.id].length < args[1]) {
                        let noPlaylist = new MessageEmbed()
                                .setColor(`#b88fff`)
                                .setTitle(`Ошибка`)
                                .setDescription(`Плейлиста с таким номером не существует.`)
                                .setTimestamp()
                                .setFooter(`${message.author.tag} • /плейлист список`, message.author.displayAvatarURL());
                        return message.channel.send(noPlaylist);
                }
                playlists[message.author.id][(args[1] - 1)].songs.forEach(song => {
                        client.player.play(message, song.url, { firstResult: true }, true);
                });
                function randomList(min, max) {
                        let rand = min - 0.5 + Math.random() * (max - min + 1);
                        return Math.round(rand);
                }
                let randomInt = randomList(1, 150)
                if (randomInt <= 30) var word = 'Ференцлист'
                else var word = 'Плейлист'
                let equipped = new MessageEmbed()
                        .setColor(`#b88fff`)
                        .setTitle(`Успешно`)
                        .setDescription(`${word} «${playlists[message.author.id][(args[1] - 1)].name}» добавлен в очередь.`)
                        .setTimestamp()
                        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(equipped);
        }else{
		try{
        	client.player.play(message, args.join(" "), { firstResult: true }, false);
		} catch (error) {
			client.logger.log(error, 'err')
			let errorEmbed = new MessageEmbed()
				.setColor("#b88fff")
				.setTitle('Ошибка')
				.setDescription('Ошибка получения данных с YouTube. Попробуйте ещё раз.')
				.setTimestamp()
				.setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(errorEmbed);
		}
        }
};

module.exports.help = {
        name: "плей",
        aliases: ["плэй", "gktq", "gk'q"],
        permissions: ["member"],
        modules: ["music"]
}