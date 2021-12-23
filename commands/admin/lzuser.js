const moment = require("moment")
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, message, args) => {
    const stats = require(`${client.config.jsonPath}/stats.json`)
	if (!args[0]) {
        let noInfo = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Lazy Cat: no info`)
		.setDescription(`Пользователь не найден.`)
        .setTimestamp()
        .setFooter(`${stats.version}`, client.user.avatarURL()) 
        return message.channel.send({embeds: [noInfo]})
    }
    var user = await client.users.fetch(message.mentions.users.first());
	let noUser = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Ошибка')
		.setDescription('Не смог получить ID пользователя.')
	if (!user) {
		try {
		  user = await client.users.fetch(args[0])
		  if (!user) return message.channel.send({embeds: [noUser]});
		}
		catch (error) {
		  return message.channel.send({embeds: [noUser]});
		}
	}
    let userdb = await client.db.getUser(user.id);
    if (!userdb) {
        let noInfo = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Ошибка`)
		.setDescription(`Пользователь не найден.`)
        return message.channel.send({embeds: [noUser]});
    }
    let userInfo = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Lazy Cat: ${user.tag}`)
		.addField(`Рыбок:`, `${userdb.balance_fish} ${client.emoji.fish}`, true)
        .addField(`Жучков:`, `${userdb.balance_bugs} ${client.emoji.bug}`, true)
        .addField(`Описание:`, `${userdb.description}`, true)
        .addField(`Присоединился:`, `${moment(new Date(Number(userdb.join_date))).locale('ru').format('LLL')}`, false)
        .addField(`Ежедневная награда:`, `${(Number(userdb.reward_daily) > Date.now()) ? moment(new Date(Number(userdb.reward_daily))).locale('ru').fromNow() : `доступна`}`, true)
        .addField(`Еженедельная награда:`, `${(Number(userdb.reward_weekly) > Date.now()) ? moment(new Date(Number(userdb.reward_weekly))).locale('ru').fromNow() : `доступна`}`, true)
        .addField(`Математика:`, `${userdb.math_level}`, true)
		.addField(`Премиум:`, `${(userdb.premium_has == 0) ? 'не активен' : 'активен'}`, true)
        .addField(`Действует до:`, `${(userdb.premium_until == '') ? 'не активен' : `${moment(new Date(Number(userdb.premium_until))).locale('ru').endOf('day').fromNow()}`}`, true)
        .addField(`Работает:`, `${(userdb.work_current == '') ? 'не работает' : `${userdb.work_current}`}`, false)
        .addField(`Текущий ранг:`, `${userdb.work_rank}`, true)
        .addField(`Количество XP:`, `${userdb.work_currentXP}`, true)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        message.channel.send({embeds: [userInfo]});
}

module.exports.data = {
    name: "lzuser",
    permissions: ["lia"],
    type: "message"
}