const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, message, args) => {
	let temp = new MessageEmbed()
		.setColor(`#b88fff`)
		.setTitle(`Недоступно.`)
		.setDescription(`К сожалению, на данный момент фильтры временно отключены.`)
		.setTimestamp()
		.setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
	//return message.channel.send(temp)
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

        let allFilters = ['8D', 'gate', 'haas', 'phaser', 'treble', 'tremolo', 'vibrato', 'reverse', 'karaoke', 'flanger', 'mcompand', 'pulsator', 'subboost', 'bassboost', 'vaporwave', 'nightcore', 'normalizer', 'surrounding']

        if (!args[0]){
            const filtersStatuses = [[], []];
            
            allFilters.forEach((filterName) => {
                const array = filtersStatuses[0].length > filtersStatuses[1].length ? filtersStatuses[1] : filtersStatuses[0];
                array.push(filterName.charAt(0).toUpperCase() + filterName.slice(1) + " : " + (client.player.getQueue(message).filters[filterName] ? '<:lz_tick:813389004330106887>' : '<:lz_cross:813388895189336124>'));
            });
            let listFilters = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Список фильтров`)
                .addField(`** **`, `${filtersStatuses[0].join('\n')}`, true)
                .addField(`** **`, `${filtersStatuses[1].join('\n')}`, true)
                .setTimestamp()
                .setFooter(`${message.author.tag} • /фильтр <название_фильтра>`, message.author.displayAvatarURL());
            return message.channel.send(listFilters);
        }
        
        const filterToUpdate = allFilters.find((x) => x.toLowerCase() === args[0].toLowerCase());

        if (!filterToUpdate){
            const filtersStatuses = [[], []];
            let allFiltres = ['8D', 'gate', 'haas', 'phaser', 'treble', 'tremolo', 'vibrato', 'reverse', 'karaoke', 'flanger', 'mcompand', 'pulsator', 'subboost', 'bassboost', 'vaporwave', 'nightcore', 'normalizer', 'surrounding']
            
            allFiltres.forEach((filterName) => {
                const array = filtersStatuses[0].length > filtersStatuses[1].length ? filtersStatuses[1] : filtersStatuses[0];
                array.push(filterName.charAt(0).toUpperCase() + filterName.slice(1) + " : " + (client.player.getQueue(message).filters[filterName] ? '<:lz_tick:813389004330106887>' : '<:lz_cross:813388895189336124>'));
            });
            let listFilters = new MessageEmbed()
                .setColor(`#b88fff`)
                .setTitle(`Список фильтров`)
                .addField(`** **`, `${filtersStatuses[0].join('\n')}`, true)
                .addField(`** **`, `${filtersStatuses[1].join('\n')}`, true)
                .setTimestamp()
                .setFooter(`${message.author.tag} • /фильтр <название_фильтра>`, message.author.displayAvatarURL());
            return message.channel.send(listFilters);
        }

        const filtersUpdated = {};

        filtersUpdated[filterToUpdate] = client.player.getQueue(message).filters[filterToUpdate] ? false : true;

        client.player.setFilters(message, filtersUpdated);
        let enabling = new MessageEmbed()
            .setColor(`#b88fff`)
            .setTitle(`Добавляю фильтр...`)
            .setTimestamp()
            .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        let disabling = new MessageEmbed()
            .setColor(`#b88fff`)
            .setTitle(`Отключаю фильтр...`)
            .setTimestamp()
            .setFooter(`${message.author.tag}`, message.author.displayAvatarURL());
        if (filtersUpdated[filterToUpdate]) message.channel.send(enabling);
        else message.channel.send(disabling);
};

module.exports.help = {
	name: "фильтр",
	aliases: ["abkmnh"],
	permissions: ["member"],
	modules: ["music"]
}