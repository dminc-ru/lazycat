const moment = require("moment")
module.exports.run = async (client, message, args) => {
    try{
        let works = client.json.works
        let noInfo = client.utils.error('Пользователь не найден.', message.author)
        if (!args[0]) {
            return message.channel.send({embeds: [noInfo]})
        }
        try{
            var user = await client.users.fetch((message.mentions.users.first() || args[0]));
        } catch (error) {
            return message.channel.send({embeds: [noInfo]})
        }
        let userdb = await client.db.getUser(user.id);
        if (!userdb) {
            return message.channel.send({embeds: [noInfo]});
        }
        var work = works.find(wrk => wrk.codename === userdb.work_current)
        let userInfo = client.utils.embed('Информация о пользователе', undefined, message.author)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
            .addField(`Рыбок:`, `\`${userdb.balance_fish}\` ${client.emoji.fish}`, true)
            .addField(`Жучков:`, `\`${userdb.balance_bugs}\` ${client.emoji.bug}`, true)
            .addField(`Описание:`, `\`${userdb.description}\``, true)
            .addField(`Присоединился:`, `\`${moment(new Date(Number(userdb.join_date))).locale('ru').format('LLL')}\``, false)
            .addField(`Ежедневная награда:`, `\`${(Number(userdb.reward_daily) > Date.now()) ? moment(new Date(Number(userdb.reward_daily))).locale('ru').fromNow() : `доступна`}\``, true)
            .addField(`Еженедельная награда:`, `\`${(Number(userdb.reward_weekly) > Date.now()) ? moment(new Date(Number(userdb.reward_weekly))).locale('ru').fromNow() : `доступна`}\``, true)
            .addField(`Математика:`, `\`${userdb.math_level}\``, true)
            .addField(`Премиум:`, `\`${(userdb.premium_has == 0) ? `не активен` : `активен`}\``, true)
            .addField(`Действует до:`, `\`${(userdb.premium_until == '') ? `-` : moment(new Date(Number(userdb.premium_until))).locale('ru').endOf('day').fromNow()}\``, true)
            .addField(`Работа:`, `\`${(userdb.work_current == '') ? `не работает` : work.name}\``, false)
            .addField(`Текущий ранг:`, (work) ? `\`${work.ranks[userdb.work_rank].name} (${userdb.work_rank}/${work.ranks.length})\`` : `\`-\``, true)
            .addField(`Количество XP:`, (work) ? `\`${userdb.work_currentXP}/${work.ranks[userdb.work_rank + 1].requiredXP}\`` : `\`-\``, true)
            message.channel.send({embeds: [userInfo]});
    } catch (error) {
        client.logger.log(error, 'err')
        console.error(error)
        message.channel.send({ content: `Произошла ошибка при выполнении команды.`})
    }
}

module.exports.data = {
    name: "lzuser",
    permissions: ["lia"],
    type: "message"
}