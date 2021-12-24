const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		let noUser = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Ошибка')
			.setDescription('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return interaction.reply({embeds: [noUser], ephemeral: true})
		}
		let userdb = await client.db.getUser(interaction.member.user.id)
		let userProfile = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Баланс')
			.setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
			.addField(`Рыбки:`, `${userdb.balance_fish} ${client.emoji.fish}`, true)
			.addField(`Жучки:`, `${userdb.balance_bugs} ${client.emoji.bug}`, true)
			.addField(`В банке:`, `${userdb.balance_bank} ${client.emoji.fish}`, false)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		interaction.reply({embeds: [userProfile]})
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
	}
}

module.exports.data = {
	name: "баланс",
	permissions: ["member"],
	type: "interaction"
}