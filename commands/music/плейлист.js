const { MessageEmbed } = require("discord.js");
let fs = require('fs');
let playlists = require(`${process.env.PATHTOBASE}/playlists.json`);
let ytdl = require('ytdl-core');
module.exports.run = async (client, message, args) => {
	if (!playlists[message.author.id]) {
		playlists[message.author.id] = [];
		fs.writeFileSync(`${process.env.PATHTOBASE}/playlists.json`, JSON.stringify(playlists, null, "\t"));
	}
    switch(args[0]){
        case 'создать': {
            const argus = message.content.split(' ').slice(2);
            if(!argus) {
                let noName = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Ошибка')
                    .setDescription('Укажите название нового плейлиста.')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL());
                message.channel.send(noName);
                break;
            }
            if(playlists[message.author.id].length >= 5) {
                let maxLength = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Ошибка')
                    .setDescription('Вы достигли лимита плейлистов — 5. В будущем этот лимит увеличится.')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL());
                message.channel.send(maxLength);
                break;
            }
            if(argus.length > 25) {
                let maxSymb = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Ошибка')
                    .setDescription(`Максимальное количество символов — 25.`)
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL());
                message.channel.send(maxSymb);
                break;  
            }
			if(argus.length < 1) {
                let maxSymb = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Ошибка')
                    .setDescription(`Минимальное количество символов — 1.`)
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL());
                message.channel.send(maxSymb);
                break;  
            }
            playlists[message.author.id].push({
                name: argus.join(' '),
                songs: []
            });
            fs.writeFileSync(`${process.env.PATHTOBASE}/playlists.json`, JSON.stringify(playlists, null, "\t"));
            let created = new MessageEmbed()
                .setColor('#b88fff')
                .setTitle('Успешно')
                .setDescription(`Плейлист «${argus.join(' ')}» создан.`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL());
            message.channel.send(created);
            break;
        }
        case 'список': {
            if(!args[1]) {
                if(playlists[message.author.id].length == 0) {
                    let empty = new MessageEmbed()
                        .setColor('#b88fff')
                        .setTitle('У вас нет плейлистов.')
                        .setTimestamp()
                        .setFooter(message.author.tag, message.author.displayAvatarURL());
                    message.channel.send(empty);
                    break;
                }
                var toSend = ``;
                var num = 1;
                playlists[message.author.id].forEach(playlist => {
                    toSend += `${num}. ${playlist.name} (${playlist.songs.length} тр.)\n`;
                    num += 1;
                });
                let list = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Список плейлистов')
                    .setDescription(`\`\`\`${toSend}\`\`\``)
                    .setTimestamp()
                    .setFooter(`${message.author.tag} • /плейлист <номер>`, message.author.displayAvatarURL());
                message.channel.send(list);
                break;
            }else{
                if (playlists[message.author.id].length < args[1]) {
                    let noPlaylist = new MessageEmbed()
                            .setColor(`#b88fff`)
                            .setTitle(`Ошибка`)
                            .setDescription(`Плейлиста с таким номером не существует.`)
                            .setTimestamp()
                            .setFooter(`${message.author.tag} • /плейлист список`, message.author.displayAvatarURL());
                    return message.channel.send(noPlaylist);
                }
                if(playlists[message.author.id][(args[1] - 1)].songs.length == 0) {
                    let empty = new MessageEmbed()
                        .setColor('#b88fff')
                        .setTitle('Этот плейлист пустой.')
                        .setTimestamp()
                        .setFooter(message.author.tag, message.author.displayAvatarURL());
                    message.channel.send(empty);
                    break;
                }
                var toSend = ``;
                var num = 1;
                playlists[message.author.id][args[1] - 1].songs.forEach(song => {
                    if(num<=10)
                        toSend += `${num}. ${song.title}\n`;
                    num += 1;
                });
                function declOfNum(n, text_forms) {  
                    n = Math.abs(n) % 100; var n1 = n % 10;
                    if (n > 10 && n < 20) { return text_forms[2]; }
                    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
                    if (n1 == 1) { return text_forms[0]; }
                    return text_forms[2];
                }
                if(num > 10)
                    var last = num - 10;
                if(last >= 1)
                    toSend += `и ещё ${last} ${declOfNum(last, ['трек', 'трека', 'треков'])}...`
                let list = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle(`Плейлист «${playlists[message.author.id][args[1] - 1].name}»`)
                    .setDescription(`\`\`\`${toSend}\`\`\``)
                    .setTimestamp()
                    .setFooter(`${message.author.tag} • /плей лист <номер>`, message.author.displayAvatarURL());
                message.channel.send(list);
                break;
            }
        }
        case 'удалить': {
            if(!args[1]) {
                let noName = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Ошибка')
                    .setDescription('Укажите номер плейлиста.')
                    .setTimestamp()
                    .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                message.channel.send(noName);
                break;
            }
            if (playlists[message.author.id].length < args[1]) {
                let noPlaylist = new MessageEmbed()
                        .setColor(`#b88fff`)
                        .setTitle(`Ошибка`)
                        .setDescription(`Плейлиста с таким номером не существует.`)
                        .setTimestamp()
                        .setFooter(`${message.author.tag} • /плейлист список`, message.author.displayAvatarURL());
                return message.channel.send(noPlaylist);
				break;
            }
            let deleted = new MessageEmbed()
                .setColor('#b88fff')
                .setTitle('Успешно')
                .setDescription(`Плейлист «${playlists[message.author.id][(args[1] - 1)].name}» удалён.`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL());
            playlists[message.author.id].splice((args[1] - 1), 1);
            fs.writeFileSync(`${process.env.PATHTOBASE}/playlists.json`, JSON.stringify(playlists, null, "\t"));
            message.channel.send(deleted);
            break;
        }
        case 'очистить': {
            if(!args[1]) {
                let noName = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Ошибка')
                    .setDescription('Укажите номер плейлиста.')
                    .setTimestamp()
                    .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                message.channel.send(noName);
                break;
            }
            if (playlists[message.author.id].length < args[1]) {
                let noPlaylist = new MessageEmbed()
                        .setColor(`#b88fff`)
                        .setTitle(`Ошибка`)
                        .setDescription(`Плейлиста с таким номером не существует.`)
                        .setTimestamp()
                        .setFooter(`${message.author.tag} • /плейлист список`, message.author.displayAvatarURL());
                return message.channel.send(noPlaylist);
				break;
            }
            let deleted = new MessageEmbed()
                .setColor('#b88fff')
                .setTitle('Успешно')
                .setDescription(`Трек «${playlists[message.author.id][(args[1] - 1)].songs[(args[2] - 1)].title}» удалён.`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL());
            playlists[message.author.id][args[1]-1].songs.splice((args[2] - 1), 1);
            fs.writeFileSync(`${process.env.PATHTOBASE}/playlists.json`, JSON.stringify(playlists, null, "\t"));
            message.channel.send(deleted);
            break;
        }
        case 'добавить': {
            if(!args[1]) {
                let noNum = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Ошибка')
                    .setDescription(`Укажите номер плейлиста для редактирования.`)
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL());
                message.channel.send(noNum);
                break;
            }
            if (playlists[message.author.id].length < args[1]) {
                let noPlaylist = new MessageEmbed()
                        .setColor(`#b88fff`)
                        .setTitle(`Ошибка`)
                        .setDescription(`Плейлиста с таким номером не существует.`)
                        .setTimestamp()
                        .setFooter(`${message.author.tag} • /плейлист список`, message.author.displayAvatarURL());
                return message.channel.send(noPlaylist);
				break;
            }
            if(!args[2]){
                let noArg = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Ошибка')
                    .setDescription(`/плейлист <номер> <очередь> — для добавления в плейлист текущей очереди
                    /плейлист <номер> <ссылка> — для добавления трека(-ов) в плейлист
                    /плей лист <номер> — добавить плейлист в текущую очередь`)
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL());
                message.channel.send(noArg);
                break;
            }
            if(args[2] == 'очередь') {
                let num = args[1] - 1;
                let queue = await client.player.getQueue(message);
                queue.tracks.forEach(track => {
                    playlists[message.author.id][num].songs.push({
                        title: track.title,
                        url: track.url
                    })
                });
                fs.writeFileSync(`${process.env.PATHTOBASE}/playlists.json`, JSON.stringify(playlists, null, "\t"));
                let addSuccess = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Успешно')
                    .setDescription(`Текущая очередь добавлена в плейлист (${queue.tracks.length} тр.)`)
                    .setTimestamp()
                    .setFooter(`${message.author.tag} • /плей лист <номер>`, message.author.displayAvatarURL());
                message.channel.send(addSuccess);
                break;
            } else {
                ytdl.getInfo(args[2], function(err, info) {
                    if (err) {
                        let invalidURL = new MessageEmbed()
                            .setColor('#b88fff')
                            .setTitle('Ошибка')
                            .setDescription(`Введите корректный URL.`)
                            .setTimestamp()
                            .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
                        return message.channel.send(invalidURL);
                    }
                    playlists[message.author.id][num].songs.push({
                        title: info.title,
                        url: args[2]
                    });
                    fs.writeFileSync(`${process.env.PATHTOBASE}/playlists.json`, JSON.stringify(playlists, null, "\t"));
                });
                let addSuccess = new MessageEmbed()
                    .setColor('#b88fff')
                    .setTitle('Успешно')
                    .setDescription(`Трек добавлен в плейлист.`)
                    .setTimestamp()
                    .setFooter(`${message.author.tag} • /плей лист <номер>`, message.author.displayAvatarURL());
                message.channel.send(addSuccess);
                break;
            }
        }
        default: {
            let cmdHelp = new MessageEmbed()
                .setColor("#b88fff")
                .setTitle('Плейлисты: список команд')
                .setDescription(`/плейлист создать <название> — создать новый плейлист
                /плейлист список [номер] — отобразить список всех плейлистов/всех треков плейлиста
                /плейлист очистить <номер плейлиста> <номер трека> — удалить трек из плейлиста
                /плейлист удалить <номер> — удалить плейлист
                /плейлист добавить <номер> <очередь/ссылка> — добавить в плейлист текущую очередь/определённый трек
                /плей лист <номер> — добавить в очередь плейлист`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL());
            message.channel.send(cmdHelp);
        }
    }
}

module.exports.help = {
    name: "плейлист",
    aliases: ["плэйлист", "gktqkbcn", "gk'qkbcn"],
    permissions: ["member"],
    modules: ["music"]
}