const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		const { body } = await request.get('https://randomfox.ca/floof');
		let noUser = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Ошибка')
			.setDescription('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return message.channel.send({embeds: [noUser]})
		}
		let foxEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setImage(body.image)
			.setTimestamp()
			.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
		interaction.reply({embeds: [foxEmbed]})
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "лис",
	permissions: ["member"],
	type: "interaction"
}