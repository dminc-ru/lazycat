const { MessageEmbed } = require('discord.js')
const config = require('../config')
module.exports = class Utils {
    static error (text, user) {
        let errMessage = new MessageEmbed()
            .setColor(config.embedColor)
            .setTitle('Ошибка')
            .setDescription(text)
            .setTimestamp()
        if (user) {
            errMessage.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({ dynamic: true}) })
        }
        return errMessage
    }

    static success (text, user) {
        let successMessage = new MessageEmbed()
            .setColor(config.embedColor)
            .setTitle('Успешно')
            .setDescription(text)
            .setTimestamp()
        if (user) {
            successMessage.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
        }
        return successMessage
    }

    static embed (title, text, user) {
        let simpleEmbed = new MessageEmbed()
            .setColor(config.embedColor)
            .setTitle(title)
            .setTimestamp()
        if (text) {
            simpleEmbed.setDescription(text)
        }
        if (user) {
            simpleEmbed.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({ dynamic: true}) })
        }
        return simpleEmbed
    }
    
    static randInt (min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }
}