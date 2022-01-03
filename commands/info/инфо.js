const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		let stats = require(`${client.config.jsonPath}stats.json`);
		let noUser = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Ошибка')
			.setDescription('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return message.channel.send({embeds: [noUser]})
		}
		var members = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
		let infoEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Информация о боте')
			.setDescription(`${client.emoji.b} Lazy Cat — универсальный бот для вашего сервера Discord.
				${client.emoji.cloud} Серверов: **${client.guilds.cache.size}**
				${client.emoji.users} Пользователей: **${members}**
				${client.emoji.cmd} Команд обработано: **${stats.commands}**

				${client.emoji.ph} Версия продукта: **${stats.version}**

				Список доступных команд: **/помощь**
				[**Добавить на свой сервер**](${client.config.inviteLink})

				[Условия использования](${client.config.termsLink})
				[Политика конфиденциальности](${client.config.privacyLink})`)
			.setTimestamp()
			.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
		interaction.reply({embeds: [infoEmbed]})
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "инфо",
	permissions: ["member"],
	type: "interaction"
}