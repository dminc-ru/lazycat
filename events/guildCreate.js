module.exports = (client, guild) => {
    let embed = new MessageEmbed()
    .setColor("b88fff")
    .setTitle("Привет!")
    .setDescription("**Я Lazy Cat — универсальный бот-менеджер.**\n\n**Используя Lazy Cat, Вы соглашаетесь с нашими [Условиями использования](https://vk.com/page-195198075_56528909) и [Политикой конфиденциальности](https://vk.com/page-201640414_54737501)**")
    .addField(`Узнать все доступные команды:`, '`/помощь`', false)
    .addField(`Техническая поддержка:`, `||[клик](https://discord.gg/gpmVkUsJjy) ||`, false)
    .setTimestamp()
    .setFooter(`Lazy Cat`, client.user.avatarURL());
    try{guild.owner.send(embed);}catch(error){return;}
};