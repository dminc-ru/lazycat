const fetch = require('node-superfetch');
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
			return message.channel.send({embeds: [noUser]})
		}
		fetch("https://aws.random.cat/meow")
			.then(res => res.json()).then((data) => {
				if(!data) return interaction.reply({content: "Произошла ошибка при получении данных. Код ошибки: LZE-007", ephemeral: true})
				let catURL = data.file
				let catEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setImage(catURL)
					.setTimestamp()
					.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
				interaction.reply({embeds: [catEmbed]})          
		});
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
	}
}

module.exports.data = {
	name: "кот",
	permissions: ["member"],
	type: "interaction"
}