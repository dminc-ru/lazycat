const moment = require("moment")
const stats = require(`${process.env.PATHTOBASE}/stats.json`)
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, message, args) => {
	if (!args[0]) {
        let noInfo = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle(`Lazy Cat: no info`)
		.setDescription(`Пользователь не найден.`)
        .setTimestamp()
        .setFooter(`${stats.version}`, client.user.avatarURL()) 
        return message.channel.send(noInfo)
    }
    let user = await client.users.cache.get(args[0]);
    let userdb = await client.db.get(args[0], 'users');
    if (!user || !userdb) {
        let noInfo = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle(`Lazy Cat: no info`)
		.setDescription(`Пользователь не найден.`)
        .setTimestamp()
        .setFooter(`${stats.version}`, client.user.avatarURL()) 
        return message.channel.send(noInfo)
    }
    let userInfo = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle(`Lazy Cat: ${user.tag}`)
		.addField(`Рыбок:`, `${userdb.balance_fish} ${client.emoji.fish}`, true)
        .addField(`Жучков:`, `${userdb.balance_bugs} ${client.emoji.bug}`, true)
        .addField(`Описание:`, `${userdb.description}`, true)
        .addField(`Присоединился:`, `${moment(new Date(Number(userdb.join_date))).locale('ru').format('LLL')}`, false)
        .addField(`Ежедневная награда:`, `${moment(new Date(Number(userdb.reward_daily))).locale('ru').fromNow()}`, true)
        .addField(`Еженедельная награда:`, `${moment(new Date(Number(userdb.reward_weekly))).locale('ru').fromNow()}`, true)
        .addField(`Математика:`, `${userdb.math_level}`, true)
		.addField(`Премиум:`, `${(userdb.premium_has == 0) ? 'не активен' : 'активен'}`, true)
        .addField(`Действует до:`, `${(userdb.premium_until == '') ? 'не активен' : `${moment(new Date(Number(userdb.premium_until))).locale('ru').endOf('day').fromNow()}`}`, true)
        .addField(`Работает:`, `${(userdb.work_current == '') ? 'не работает' : `${userdb.work_current}`}`, false)
        .addField(`Текущий ранг:`, `${userdb.work_rank}`, true)
        .addField(`Количество XP:`, `${userdb.work_currentXP}`, true)
        .setTimestamp()
        .setFooter(`${stats.version}`, client.user.avatarURL())
    message.channel.send(userInfo)
}

module.exports.help = {
    name: "lzuser",
    aliases: [],
    permissions: ["lia"],
    modules: ["admin"]
}