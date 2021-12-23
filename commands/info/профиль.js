module.exports.run = async (client, interaction) => {
	let badgebase = require(`${client.config.jsonPath}badges.json`);
	let userdb = await client.db.getUser(interaction.member.user.id)
	var memberProfile
	if(interaction.data.options)
		memberProfile = await client.users.fetch(interaction.data.options[0].value);
	let user = await client.users.fetch(interaction.member.user.id);
	let badgess = [];
	if(!memberProfile) {
		let userbadges = userdb.badges.split(',')
		userbadges.length--
		userbadges.map(badge => {
			let emoji = badgebase.find(badg => badg.codename === badge).emoji;
			let name = badgebase.find(badg => badg.codename === badge).name;
			badgess.push(`${emoji} ${name}`);
		});
		if(badgess == '')
			badgess.push(`-`);
		let profileEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Профиль')
			.setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
			.setDescription(`**Описание:** ${userdb.description}`)
			.addField('Баланс', `${userdb.balance_fish} ${client.emoji.fish}`, true)
			.addField('В банке:', `${userdb.balance_bank} ${client.emoji.fish}`, true)
			.addField('Жучков:', `${userdb.balance_bugs} ${client.emoji.bug}`, true)
			.addField('Значки:', `${badgess.join('\n')}`, false)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [profileEmbed]})
	}
	else {
		let memberdb = await client.db.getUser(memberProfile.id)
		if(!memberdb)
			return interaction.reply({content: "Указанный пользователь не зарегистрирован в системе Lazy Cat.", ephemeral: true})
		let memberbadges = memberdb.badges.split(',')
		memberbadges.length--
		memberbadges.map(badge => {
			let emoji = badgebase.find(badg => badg.codename === badge).emoji;
			let name = badgebase.find(badg => badg.codename === badge).name;
			badgess.push(`${emoji} ${name}`);
		});
		if(badgess == '')
			badgess.push(`-`);
		let profileEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Профиль')
			.setAuthor(memberProfile.tag, memberProfile.displayAvatarURL({dynamic: true}))
			.setDescription(`**Описание:** ${memberdb.description}`)
			.addField('Баланс', `${memberdb.balance_fish} ${client.emoji.fish}`, true)
			.addField('В банке:', `${memberdb.balance_bank} ${client.emoji.fish}`, true)
			.addField('Жучков:', `${memberdb.balance_bugs} ${client.emoji.bug}`, true)
			.addField('Значки:', `${badgess.join('\n')}`, false)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [profileEmbed]})
	}
}

module.exports.data = {
	name: "профиль",
	permissions: ["member"],
	type: "interaction"
}