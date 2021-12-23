const { MessageEmbed } = require('discord.js')
module.exports = (client, guild) => {
    let embed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle("Привет!")
        .setDescription(`**Я Lazy Cat — универсальный бот-менеджер.**
        
        **Используя Lazy Cat, Вы соглашаетесь с нашими [Условиями использования](${client.config.termsLink}) и [Политикой конфиденциальности](${client.config.privacyLink})**
        `)
        .addField(`Узнать все доступные команды:`, '`/помощь`', false)
        .addField(`Техническая поддержка:`, `||[клик](${client.config.serverLink})||`, false)
        .setTimestamp()
        .setFooter(`Lazy Cat`, client.user.displayAvatarURL({dynamic: true}));
    try {
        guild.owner.send(embed);
    } catch(error)
    {
        return;
    }
};