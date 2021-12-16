module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let userdb = await client.db.getUser(interaction.member.user.id)
	let money = interaction.data.options[0].value;
	money = Number(interaction.data.options[0].value);
	if(money < 1)
		return interaction.reply({content: "Укажите корректное количество жучков.", ephemeral: true})
	if(money > userdb.balance_bugs)
		return interaction.reply({content: "У вас недостаточно жучков.", ephemeral: true})
	function random(min, max) {
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}
	await client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs - money))
	let roulette = [":coconut:", ":banana:", ":watermelon:", ":green_apple:", ":strawberry:", ":cherries:"];
	let first = random(0, 5);
	let second = random(0, 5);
	let third = random(0, 5);
	if(first == second && second == third){
		userdb = await client.db.getUser(interaction.member.user.id)
		let toDeposit = money * 2;
		client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs + toDeposit))
		let winEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Коробка')
			.setDescription(`${roulette[first]} | ${roulette[second]} | ${roulette[third]}
			
			**Вы выиграли ${toDeposit}** ${client.emoji.bug}`)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [winEmbed]})
	}
	let loseEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Коробка')
		.setDescription(`${roulette[first]} | ${roulette[second]} | ${roulette[third]}
		
		Вы проиграли ${money} ${client.emoji.bug}`)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	return interaction.reply({embeds: [loseEmbed]})
}

module.exports.data = {
	name: "покрути",
	permissions: ["tester"],
	type: "interaction"
}