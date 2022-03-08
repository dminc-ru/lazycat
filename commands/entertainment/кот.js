const fetch = require('node-superfetch');
module.exports.run = async (client, interaction) => {
	try {
		let noUser = client.utils.error('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return message.channel.send({embeds: [noUser]})
		}
		fetch("https://aws.random.cat/meow")
			.then(res => res.json()).then((data) => {
				if(!data) return interaction.reply({content: "Произошла ошибка при получении данных. Код ошибки: LZE-007", ephemeral: true})
				let catURL = data.file
				let catEmbed = client.utils.embed(undefined, undefined, user)
					.setImage(catURL)
				interaction.reply({embeds: [catEmbed]})          
		});
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "кот",
	permissions: ["member"],
	type: "interaction"
}