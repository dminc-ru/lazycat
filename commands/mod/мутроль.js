const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		try {
			var user = await client.users.fetch(interaction.member.user.id);
			var guild = await client.guilds.fetch(interaction.guildId);
			var member = await guild.members.fetch(interaction.member.user.id);
		} catch (error) {
			return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
		}
		if( !member.hasPermission('ADMINISTRATOR') ) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
		}
		client.db.changeGuild(interaction.guildId, 'muteRole', interaction.options.getRole('роль'))
		let successEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Успешно')
			.setDescription('Роль для мута установлена.')
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [successEmbed]})
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
	}
}

module.exports.data = {
	name: "мутроль",
	permissions: ["member"],
	type: "interaction"
}