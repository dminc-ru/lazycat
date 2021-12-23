module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let guild = await client.guilds.fetch(interaction.guildId);
	let member = await guild.members.fetch(interaction.member.user.id);
	if( !member.hasPermission('ADMINISTRATOR') ) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	client.db.changeGuild(interaction.guildId, 'muteRole', interaction.data.options[0].value)
	let successEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Успешно')
		.setDescription('Роль для мута установлена.')
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	return interaction.reply({embeds: [successEmbed]})
}

module.exports.data = {
	name: "мутроль",
	permissions: ["member"],
	type: "interaction"
}