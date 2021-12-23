module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let guild = await client.guilds.fetch(interaction.guildId);
	let guilddb = await client.db.getGuild(interaction.guildId)
	let member = await guild.members.fetch(interaction.member.user.id);
	var typeLog = interaction.data.options[0].name;
	if ( !member.hasPermission('ADMINISTRATOR') ) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	if (typeLog == "чат") {
		client.db.changeGuild(interaction.guildId, 'logmsg_channel', interaction.data.options[0].options[1].value)
		let successEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Успешно')
			.setDescription('Канал для логов установлен. Теперь туда будут отправляться сообщения о действиях модераторов.')
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [successEmbed]})
	}
	if (typeLog == "мсг") {
		let typeAction = interaction.data.options[0].options[0].name;
		if (typeAction == "вкл"){
			if (guilddb.logmsg_enable == 'false') {
				return interaction.reply({content: `Аудит сообщений уже включен. Включить — /лог мсг выкл`, ephemeral: true})
			}
			if (guilddb.logmsg_channel == '') {
				return interaction.reply({content: `Сначала необходимо установить канал для логов — /лог чат <#канал>`, ephemeral: true})
			}
			client.db.changeGuild(interaction.guildId, 'logmsg_enable', 'true')
			client.db.changeGuild(interaction.guildId, 'logmsg_type_edit', 'false')
			client.db.changeGuild(interaction.guildId, 'logmsg_type_delete', 'true')
			let auditEnabled = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Аудит сообщений включён. Отключить — /лог мсг выкл`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [auditEnabled]})
		}
		if (typeAction == "выкл"){
			if (guilddb.logmsg_enable == 'false'){
				return interaction.reply({content: `Аудит сообщений уже выключен. Включить — /лог мсг вкл`, ephemeral: true})
			}
			if (guilddb.logmsg_channel == ''){
				return interaction.reply({content: `Сначала необходимо установить канал для логов — /лог чат <#канал>`, ephemeral: true})
			}
			client.db.changeGuild(interaction.guildId, 'logmsg_enable', 'false')
			let auditDisabled = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Аудит сообщений выключен. Включить снова — /лог мсг вкл`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [auditDisabled]})
		}
		if (typeAction == "удалить"){
			let subTypeAction = interaction.data.options[0].options[0].options[0].name;
			if(guilddb.logmsg_enable == 'false'){
				return interaction.reply({content: `Сначала нужно включить аудит сообщений — /логмсг вкл`, ephemeral: true})
			}
			if(guilddb.logmsg_channel == ''){
				return interaction.reply({content: `Сначала необходимо установить канал для логов — /лог чат <#канал>`, ephemeral: true})
			}
			if(subTypeAction == "вкл"){
				if(guilddb.logmsg_type_delete == 'true'){
					return interaction.reply({content: `Аудит удаления сообщений уже включен. Выключить — /лог мсг удалить выкл`, ephemeral: true})
				}
				client.db.changeGuild(interaction.guildId, 'logmsg_type_delete', 'true')
				let auditDeleteEnabled = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Успешно')
					.setDescription(`Аудит удаления сообщений включен. Выключить — /лог мсг удалить выкл`)
					.setTimestamp()
					.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
				return interaction.reply({embeds: [auditDeleteEnabled]})
			}
			if(subTypeAction == "выкл"){
				if(guilddb.logmsg_type_delete == 'false'){
					return interaction.reply({content: `Аудит удаления сообщений уже выключен. Включить — /лог мсг удалить вкл`, ephemeral: true})
				}
				client.db.changeGuild(interaction.guildId, 'logmsg_type_delete', 'false')
				let auditDeleteDisabled = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Успешно')
					.setDescription('Аудит удаления сообщений выключен. Включить — /лог мсг удалить вкл')
					.setTimestamp()
					.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
				return interaction.reply({embeds: [auditDeleteDisabled]})
			}
		}
		if(typeAction == "эдит"){
			let subTypeAction = interaction.data.options[0].options[0].options[0].name;
			if(guilddb.logmsg_enable == 'false'){
				return interaction.reply({content: `Сначала нужно включить аудит сообщений — /лог мсг вкл`, ephemeral: true})
			}
			if(guilddb.logmsg_channel == ''){
				return interaction.reply({content: `Сначала необходимо установить канал для логов — /лог чат <#канал>`, ephemeral: true})
			}
			if(subTypeAction == "вкл"){
				if(guilddb.logmsg_type_edit == 'true'){
					return interaction.reply({content: `Аудит редактирования сообщений уже включен. Выключить — /лог мсг эдит выкл`, ephemeral: true})
				}
				client.db.changeGuild(interaction.guildId, 'logmsg_type_edit', 'true')
				let auditEditEnabled = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Успешно')
					.setDescription(`Аудит редактирования сообщений включен. Выключить — /лог мсг эдит выкл`)
					.setTimestamp()
					.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
				return interaction.reply({embeds: [auditEditEnabled]})
			}
			if(subTypeAction == "выкл"){
				if(guilddb.logmsg_type_edit == 'false'){
					return interaction.reply({content: `Аудит редактирования сообщений уже выключен. Включить — /лог мсг эдит вкл`, ephemeral: true})
				}
				client.db.changeGuild(interaction.guildId, 'logmsg_type_edit', 'false')
				let auditEditDisabled = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Успешно')
					.setDescription('Аудит редактирования сообщений выключен. Включить — /лог мсг эдит вкл')
					.setTimestamp()
					.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
				return interaction.reply({embeds: [auditEditDisabled]})
			}
		}
	}
}

module.exports.data = {
	name: "лог",
	permissions: ["tester"],
	type: "interaction"
}