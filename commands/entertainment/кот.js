const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
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
}

module.exports.data = {
	name: "кот",
	permissions: ["member"],
	type: "interaction"
}