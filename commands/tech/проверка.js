const Command = require('../../class/Command')

class Check extends Command {
	constructor(client) {
		super(client, {
			name: 'проверка',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: true
		})
	}

	async run (client, interaction) {
		try {
			try {
				var guild = await client.guilds.fetch(interaction.guildId);
				var user = await client.users.fetch(interaction.member.user.id);
				var member = await guild.members.fetch(interaction.member.user.id);
			} catch(error) {
				return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
			}
			let tick = client.emoji.tick
			let cross = client.emoji.cross
			if ( !member.permissions.has("ADMINISTRATOR") ) {
				return interaction.reply({content: `Недостаточно прав для выполнения этой команды.`, ephemeral: true})
			}
			let checkEmbed = client.utils.embed('Проверка разрешений для бота', `**Для корректной работы функций необходимы следующие права:**
					${(guild.me.permissions.has("MANAGE_ROLES")) ? tick : cross} Управлять ролями
					${(guild.me.permissions.has("MANAGE_CHANNELS")) ? tick : cross} Управлять каналами
					${(guild.me.permissions.has("KICK_MEMBERS")) ? tick : cross} Выгонять участников
					${(guild.me.permissions.has("BAN_MEMBERS")) ? tick : cross} Банить 
					${(guild.me.permissions.has("MODERATE_MEMBERS")) ? tick: cross} Отправлять участников подумать о своём поведении
					${(guild.me.permissions.has("MANAGE_NICKNAMES")) ? tick : cross} Управлять никнеймами
					${(guild.me.permissions.has("CHANGE_NICKNAME")) ? tick : cross} Изменять никнейм
					${(guild.me.permissions.has("VIEW_AUDIT_LOG")) ? tick : cross} Просматривать журнал аудита
					${(guild.me.permissions.has("MANAGE_MESSAGES")) ? tick : cross} Управлять сообщениями
					${(guild.me.permissions.has("ATTACH_FILES")) ? tick : cross} Прикреплять файлы
					${(guild.me.permissions.has("READ_MESSAGE_HISTORY")) ? tick : cross} Просматривать историю сообщений
					${(guild.me.permissions.has("ADD_REACTIONS")) ? tick : cross} Добавлять реакции
					${(guild.me.permissions.has("USE_EXTERNAL_EMOJIS")) ? tick : cross} Использовать внешние эмодзи
					${(guild.me.permissions.has("CONNECT")) ? tick : cross} Подключаться
					${(guild.me.permissions.has("SPEAK")) ? tick : cross} Говорить
					${(guild.me.permissions.has("MUTE_MEMBERS")) ? tick : cross} Отключать участникам микрофон
					${(guild.me.permissions.has("DEAFEN_MEMBERS")) ? tick : cross} Отключать участникам звук
					${(guild.me.permissions.has("USE_VAD")) ? tick : cross} Просматривать активность голосового чата`, user
				)
			return interaction.reply({embeds: [checkEmbed]})
		} catch(error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Check;