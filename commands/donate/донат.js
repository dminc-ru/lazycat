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
		let donateEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`${client.emoji.heart} Донат`)
			.setDescription(`Здесь вы можете материально поддержать разработку Lazy Cat. Спасибо!`)
			.addField(`${client.emoji.da} Donation Alerts`, `[клик](${client.config.daLink})`)
			.setTimestamp()
			.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
		interaction.reply({embeds: [donateEmbed]})
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "донат",
	permissions: ["member"],
	type: "interaction"
}