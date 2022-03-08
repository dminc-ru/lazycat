module.exports.run = async (client, interaction) => {
	try {
		let noUser = client.utils.error('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return message.channel.send({embeds: [noUser]})
		}
		let userdb = await client.db.getUser(interaction.member.user.id)
		let money = interaction.options.getInteger('ставка');
		if(money < 1)
			return interaction.reply({content: "Укажите корректное количество жучков.", ephemeral: true})
		if(money > userdb.balance_bugs)
			return interaction.reply({content: "У вас недостаточно жучков.", ephemeral: true})
		await client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs - money))
		let roulette = [":coconut:", ":banana:", ":watermelon:", ":green_apple:", ":strawberry:", ":cherries:"];
		let first = client.utils.randInt(0, 5);
		let second = client.utils.randInt(0, 5);
		let third = client.utils.randInt(0, 5);
		if(first == second && second == third){
			userdb = await client.db.getUser(interaction.member.user.id)
			let toDeposit = money * 2;
			client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs + toDeposit))
			let winEmbed = client.utils.embed('Коробка', `${roulette[first]} | ${roulette[second]} | ${roulette[third]}
				
				**Вы выиграли ${toDeposit}** ${client.emoji.bug}`, user)
			return interaction.reply({embeds: [winEmbed]})
		}
		let loseEmbed = client.utils.embed('Коробка', `${roulette[first]} | ${roulette[second]} | ${roulette[third]}
			
				Вы проиграли ${money} ${client.emoji.bug}`, user)
		return interaction.reply({embeds: [loseEmbed]})
	} catch (error) {
		client.logger.log(error)
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "покрути",
	permissions: ["tester"],
	type: "interaction"
}