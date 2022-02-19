const { MessageEmbed } = require('discord.js')
module.exports = class Utils {
    static createError (text, user) {
        let errMessage = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('Ошибка')
            .setDescription(text)
            .setTimestamp()
        if (user) {
            errMessage.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({ dynamic: true}) })
        }
        return errMessage
    }

    static createSuccess (text, user) {
        let successMessage = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('Успешно')
            .setDescription(text)
            .setTimestamp()
        if (user) {
            successMessage.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
        }
        return successMessage
    }

    static createEmbed (title, text, user) {
        let simpleEmbed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(title)
            .setDescription(text)
            .setTimestamp()
        if (user) {
            successMessage.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({ dynamic: true}) })
        }
    }
}