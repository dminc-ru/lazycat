module.exports.run = async (client, interaction) => {
	try {
		let userdb = await client.db.getUser(interaction.member.user.id)
		let noUser = client.utils.error('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return interaction.reply({embeds: [noUser], ephemeral: true})
		}
		try {
			var channel = await client.channels.fetch(interaction.channelId);
		} catch (error) {
			return interaction.reply({content: 'Не могу получить доступ к текстовому каналу.', ephemeral: true})
		}
		var whattoDo = interaction.options.getSubcommand();	
		switch (whattoDo) {
			case 'положить': {
				var money = interaction.options.getInteger('сумма')
				if(money < 1) {
					interaction.reply({content: `Укажите корректное количество ${client.emoji.fish}`, ephemeral: true})
					break
				}
				if(userdb.balance_fish < money) {
					interaction.reply({content: `У вас недостаточно средств.`, ephemeral: true})
					break
				}
				client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - money))
				client.db.changeUser(interaction.member.user.id, 'balance_bank', (userdb.balance_bank + money))
				let successEmbed = client.utils.success(`На ваш счёт зачислено ${money} ${client.emoji.fish}`, user)
				interaction.reply({embeds: [successEmbed]})
				break
			}
			case 'снять': {
				var money = interaction.options.getInteger('сумма');
				if(money < 1) {
					interaction.reply({content: `Укажите корректное количество ${client.emoji.fish}`, ephemeral: true})
					break
				}
				if(userdb.balance_bank < money) {
					interaction.reply({content: `У вас недостаточно средств.`, ephemeral: true})
					break
				}
				client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + money))
				client.db.changeUser(interaction.member.user.id, 'balance_bank', (userdb.balance_bank - money))
				let successEmbed = client.utils.success(`Успешно! Вы сняли ${money} ${client.emoji.fish} с вашего счёта.`, user)
				interaction.reply({embeds: [successEmbed]})
				break
			}
			case 'ограбить': {
				var generatedCode = "";
				let firstNumber = client.utils.randInt(1, 9);
				generatedCode += firstNumber;
				let secondNumber = client.utils.randInt(1, 9);
				generatedCode += secondNumber;
				let thirdNumber = client.utils.randInt(1, 9);
				generatedCode += thirdNumber;
				let fourthNumber = client.utils.randInt(1, 9);
				var guessNumber = String(fourthNumber)
				generatedCode += "[]"
				let fiveNumber = client.utils.randInt(1, 9);
				generatedCode += fiveNumber;
				let robberyEmbed = client.utils.embed('Банк: ограбление', `Вы подошли к хранилищу банка и достали кусок бумаги, купленный в DarkCat. \`${generatedCode}\`\nУгадайте цифру кода.`, user)
				interaction.reply({embeds: [robberyEmbed]})
				const filter = message => message.author.id === interaction.member.user.id;
				const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
				var answered = false;
				collector.on('collect', async m => {
					if (m.content == guessNumber) {
						let reward = client.utils.randInt(150, 200);
						userdb = await client.db.getUser(interaction.member.user.id)
						client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + reward))
						let successEmbed = client.utils.embed('Банк: ограбление', `Код введён. Хранилище открылось! Вы забрали ${reward} ${client.emoji.fish}`, user)
						interaction.editReply({embeds: [successEmbed]})
						answered = true
						return collector.stop()
					} else {
						let failEmbed = client.utils.embed('Банк: ограбление', `Код введён. Сработала сигнализация! Вы смогли убежать от охраны этого банка.`, user)
						interaction.editReply({embeds: [failEmbed]})
						answered = true
						return collector.stop()
					}
				});
	
				collector.on('end', collected => {
					if (!answered) {
						let failEmbed = client.utils.embed('Банк: ограбление', `Пока вы думали, вас заметила охрана этого банка. Вы смогли убежать.`, user)
						return interaction.editReply({embeds: [failEmbed]})
					} else { 
						return
					}
				});
				break
			}
		}
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}
module.exports.data = {
	name: "банк",
	permissions: ["member"],
	type: "interaction"
}