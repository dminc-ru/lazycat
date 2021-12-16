const request = require('node-superfetch');
module.exports.run = async (client, interaction) => {
	const { body } = await request.get('https://randomfox.ca/floof');
	let user = await client.users.fetch(interaction.member.user.id);
	let foxEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setImage(body.image)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	interaction.reply({embeds: [foxEmbed]})
}

module.exports.data = {
	name: "лис",
	permissions: ["member"],
	type: "interaction"
}