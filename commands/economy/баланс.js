module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let userdb = await client.db.get(interaction.member.user.id, 'users')
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
}

module.exports.data = {
	name: "баланс",
	permissions: ["member"],
	type: "interaction"
}