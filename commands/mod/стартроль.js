module.exports.run = async (client, interaction) => {
	let guild = await client.guilds.fetch(interaction.guild_id);
	let guilddb = await client.db.getGuild(interaction.guild_id)
	let user = await client.users.fetch(interaction.member.user.id);
	let member = await guild.members.fetch(interaction.member.user.id);
	var whattoDo = interaction.data.options[0].name;
	if ( !member.hasPermission('ADMINISTRATOR') ) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	if (whattoDo == 'выкл') {
		if (guilddb.giveRole == "false") {
			return interaction.reply({content: `Автоматическая выдача роли уже отключена. Включить — /стартроль вкл`, ephemeral: true})
		}
		if (guilddb.welcomeRole == '') {
			return interaction.reply({content: `Сначала необходимо установить роль — /стартроль установить <@Роль>`, ephemeral: true})
		}
		client.db.changeGuild(interaction.guild_id, 'giveRole', 'false')
		let autoRoleDisabled = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Успешно')
			.setDescription('Автоматическая выдача роли новым участникам отключена. Включить снова — /стартроль вкл')
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [autoRoleDisabled]})
	}
	if (whattoDo == 'вкл') {
		if (guilddb.giveRole == 'true') {
			return interaction.reply({content: `Автоматическая выдача роли уже включена. Отключить — /стартроль выкл`, ephemeral: true})
		}
		if (guilddb.welcomeRole == '') {
			return interaction.reply({content: `Сначала необходимо установить роль — /стартроль установить @Роль`, ephemeral: true})
		}
		client.db.changeGuild(interaction.guild_id, 'giveRole', 'true')
		let autoRoleEnabled = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Успешно')
			.setDescription('Автоматическая выдача роли новым участникам включена. Отключить — /стартроль выкл')
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [autoRoleEnabled]})
	}
	startRole = interaction.data.options[0].options[0].value;
	client.db.changeGuild(interaction.guild_id, 'welcomeRole', startRole)
	let successEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Успешно')
		.setDescription('Теперь эта роль будет выдаваться всем участникам. Выдачу роли можно отключить командой /стартроль выкл')
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	return interaction.reply({embeds: [successEmbed]})
}

module.exports.data = {
	name: "стартроль",
	permissions: ["member"],
	type: "interaction"
}