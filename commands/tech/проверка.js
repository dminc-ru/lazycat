module.exports.run = async (client, interaction) => {
	let guild = await client.guilds.fetch(interaction.guildId);
	let user = await client.users.fetch(interaction.member.user.id);
	let member = await guild.members.fetch(interaction.member.user.id);
	let tick = client.emoji.tick
	let cross = client.emoji.cross
	if ( !member.hasPermission("ADMINISTRATOR") ) {
		return interaction.reply({content: `Недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	let checkEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Проверка разрешений для бота')
		.setDescription(`**Для корректной работы функций необходимы следующие права:**
			${(guild.me.hasPermission("MANAGE_ROLES")) ? tick : cross} Управлять ролями
			${(guild.me.hasPermission("MANAGE_CHANNELS")) ? tick : cross} Управлять каналами
			${(guild.me.hasPermission("KICK_MEMBERS")) ? tick : cross} Выгонять участников
			${(guild.me.hasPermission("BAN_MEMBERS")) ? tick : cross} Банить участников
			${(guild.me.hasPermission("MANAGE_NICKNAMES")) ? tick : cross} Управлять никнеймами
			${(guild.me.hasPermission("CHANGE_NICKNAME")) ? tick : cross} Изменять никнейм
			${(guild.me.hasPermission("VIEW_AUDIT_LOG")) ? tick : cross} Просматривать журнал аудита
			${(guild.me.hasPermission("MANAGE_MESSAGES")) ? tick : cross} Управлять сообщениями
			${(guild.me.hasPermission("ATTACH_FILES")) ? tick : cross} Прикреплять файлы
			${(guild.me.hasPermission("READ_MESSAGE_HISTORY")) ? tick : cross} Просматривать историю сообщений
			${(guild.me.hasPermission("ADD_REACTIONS")) ? tick : cross} Добавлять реакции
			${(guild.me.hasPermission("USE_EXTERNAL_EMOJIS")) ? tick : cross} Использовать внешние эмодзи
			${(guild.me.hasPermission("CONNECT")) ? tick : cross} Подключаться
			${(guild.me.hasPermission("SPEAK")) ? tick : cross} Говорить
			${(guild.me.hasPermission("MUTE_MEMBERS")) ? tick : cross} Отключать участникам микрофон
			${(guild.me.hasPermission("DEAFEN_MEMBERS")) ? tick : cross} Отключать участникам звук
			${(guild.me.hasPermission("USE_VAD")) ? tick : cross} Просматривать активность голосового чата`
		)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	return interaction.reply({embeds: [checkEmbed]})
}

module.exports.data = {
	name: "проверка",
	permissions: ["member"],
	type: "interaction"
}