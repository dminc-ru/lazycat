module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let userdb = await client.db.getUser(interaction.member.user.id)
	let memberdb = await client.db.getUser(interaction.data.options[0].value);
	var money = interaction.data.options[1].value;
	money = Number(interaction.data.options[1].value);
	if(interaction.member.user.id == interaction.data.options[0].value)
		return interaction.reply({content: "Вы не можете передать рыбки самому себе.", ephemeral: true})
	if(!memberdb)
		return interaction.reply({content: "Указанный пользователь не зарегистрирован в системе Lazy Cat.", ephemeral: true})
	if(money > 10000)
		return interaction.reply({content: `Вы можете перевести максимум 10000 ${client.emoji.fish} за одну транзакцию.`})
	if( (money == 0) || (money < 0) )
		return interaction.reply({content: "Укажите корректное количество рыбок.", ephemeral: true})
	if(userdb.balance_fish < money)
		return interaction.reply({content: "У вас недостаточно средств.", ephemeral: true})
	let receive = await client.db.getUser(interaction.data.options[0].value)
	if(!receive)
		return interaction.reply({content: "Указанный пользователь не зарегистрирован в системе Lazy Cat.", ephemeral: true})
	await client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - money))
	await client.db.changeUser(interaction.data.options[0].value, 'balance_fish', (memberdb.balance_fish + money))
	let successTransaction = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Транзакция')
		.setDescription(`Успешно! Переведено ${money} ${client.emoji.fish}`)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	return interaction.reply({embeds: [successTransaction]})
}

module.exports.help = {
	name: "передать",
	permissions: ["member"],
	type: "interaction"
}