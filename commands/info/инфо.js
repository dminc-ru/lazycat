module.exports.run = async (client, interaction) => {
	let stats = require(`${client.config.jsonPath}/stats.json`);
	let user = await client.users.fetch(interaction.member.user.id);
	var members = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
	let infoEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Информация о боте')
		.setDescription(`${client.emoji.b} Lazy Cat — универсальный бот для вашего сервера Discord.
			${client.emoji.cloud} Серверов: **${client.guilds.cache.size}**
			${client.emoji.users} Пользователей: **${members}**
			${client.emoji.cmd} Команд обработано: **${stats.commands}**

			Список доступных команд: **/помощь**
			[**Добавить на свой сервер**](${client.config.inviteLink})

			[Условия использования](${client.config.termsLink})
			[Политика конфиденциальности](${client.config.privacyLink})`)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	interaction.reply({embeds: [infoEmbed]})
}

module.exports.data = {
	name: "инфо",
	permissions: ["member"],
	type: "interaction"
}