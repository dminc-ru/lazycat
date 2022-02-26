module.exports.run = async (client, interaction) => {
	try {
		let noUser = client.utils.error('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return interaction.reply({embeds: [noUser], ephemeral: true})
		}
		let userdb = await client.db.getUser(interaction.member.user.id)
		let memberdb = await client.db.getUser(interaction.options.getUser('участник').id);
		var money = interaction.options.getInteger('количество');
		if(interaction.member.user.id == memberdb.discord_id)
			return interaction.reply({content: "Вы не можете передать рыбки самому себе.", ephemeral: true})
		if(!memberdb)
			return interaction.reply({content: "Указанный пользователь не зарегистрирован в системе Lazy Cat.", ephemeral: true})
		if(money > 10000)
			return interaction.reply({content: `Вы можете перевести максимум 10000 ${client.emoji.fish} за одну транзакцию.`})
		if( (money == 0) || (money < 0) )
			return interaction.reply({content: "Укажите корректное количество рыбок.", ephemeral: true})
		if(userdb.balance_fish < money)
			return interaction.reply({content: "У вас недостаточно средств.", ephemeral: true})
		await client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - money))
		await client.db.changeUser(memberdb.discord_id, 'balance_fish', (memberdb.balance_fish + money))
		let successTransaction = client.utils.success(`Успешно! Переведено ${money} ${client.emoji.fish}`, user)
		return interaction.reply({embeds: [successTransaction]})
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "передать",
	permissions: ["member"],
	type: "interaction"
}