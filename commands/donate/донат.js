module.exports.run = async (client, interaction) => {
		let user = await client.users.fetch(interaction.member.user.id);
		let donateEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`${client.emoji.heart} Донат`)
			.setDescription(`Здесь вы можете материально поддержать разработку Lazy Cat. Спасибо!`)
			.addField(`${client.emoji.da} Donation Alerts`, `[клик](${client.config.daLink})`)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		interaction.reply({embeds: [donateEmbed]})
}

module.exports.data = {
	name: "донат",
	permissions: ["member"],
	type: "interaction"
}