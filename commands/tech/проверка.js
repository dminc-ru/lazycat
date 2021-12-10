module.exports.run = async (client, interaction) => {
	try{
		let guild = client.guilds.cache.get(interaction.guild_id);
		let user = client.users.cache.get(interaction.member.user.id);
		let member = guild.members.cache.get(interaction.member.user.id);
		let tick = `<:lz_tick:813389004330106887>`
		let cross = `<:lz_cross:813388895189336124>`
		if(!member.hasPermission("ADMINISTRATOR"))
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Недостаточно прав для выполнения этой команды.`
				}
			}
		});
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Проверка разрешений для бота',
								description: `**Для корректной работы функций необходимы следующие права:**
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
								${(guild.me.hasPermission("USE_VAD")) ? tick : cross} Просматривать активность голосового чата
								`,
								timestamp: new Date(),
								footer: {
									text: `${user.tag}`,
									icon_url: `${user.displayAvatarURL()}`,
								}
							}
						]
					}
				}
			});
	}
	catch(error){
		client.logger.log(`${error}`, "err");
		console.log(error)
	}
}

module.exports.help = {
	name: "проверка",
	aliases: ["ghjdthrf"],
	permissions: ["member"],
	modules: ["tech"]
}