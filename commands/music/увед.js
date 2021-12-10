const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, message, args) => {
    let guilddb = await client.db.get(message.guild.id, 'guilds')
    if (guilddb.disabledRadioNot == 'false')
        check = false
    else check = true
    switch(args[0]) {
        case 'выкл': {
            if(guilddb.disabledRadioNot == 'true'){
                let alreadyDis = new MessageEmbed()
                    .setColor("#b88fff")
                    .setTitle('Ошибка')
                    .setDescription('Уведомления «Радио» уже отключены.')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL())
                message.channel.send(alreadyDis);
                break;
            }
            client.db.change(message.guild.id, 'guilds', 'disabledRadioNot', 'true')
            let disabled = new MessageEmbed()
                .setColor("#b88fff")
                .setTitle('Успешно')
                .setDescription('Уведомления «Радио» успешно отключены.')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL());
            message.channel.send(disabled);
            break;
        }
        case 'вкл': {
            if(guilddb.disabledRadioNot == 'false'){
                let alreadyEn = new MessageEmbed()
                    .setColor("#b88fff")
                    .setTitle('Ошибка')
                    .setDescription('Уведомления «Радио» уже включены.')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL())
                message.channel.send(alreadyEn);
                break;
            }
            client.db.change(message.guild.id, 'guilds', 'disabledRadioNot', 'false')
            let disabled = new MessageEmbed()
                .setColor("#b88fff")
                .setTitle('Успешно')
                .setDescription('Уведомления «Радио» успешно включены.')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL());
            message.channel.send(disabled);
            break;
        }
        default: {
            let disabled = new MessageEmbed()
                .setColor("#b88fff")
                .setTitle('Уведомления «Радио»')
                .setDescription(`Текущий статус: **${(check) ? 'отключено' : 'включено'}**
                
                /увед вкл — включить уведомления («Сейчас играет», «Очередь закончилась»)
                /увед выкл — выключить уведомления`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL());
            message.channel.send(disabled);
            break;
        }
    }
}

module.exports.help = {
	name: "увед",
	aliases: ["edtl"],
	permissions: ["member"],
	modules: ["music"]
}