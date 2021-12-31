const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		let userdb = await client.db.getUser(interaction.member.user.id)
		let noUser = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Ошибка')
			.setDescription('Пользователь не найден в базе данных.')
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
		if(whattoDo == "положить"){
			var money = interaction.options.getInteger('сумма')
			if(money < 1)
				return interaction.reply({content: `Укажите корректное количество ${client.emoji.fish}`, ephemeral: true})
			if(userdb.balance_fish < money)
				return interaction.reply({content: `У вас недостаточно средств.`, ephemeral: true})
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - money))
			client.db.changeUser(interaction.member.user.id, 'balance_bank', (userdb.balance_bank + money))
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Транзакция')
				.setDescription(`Успешно! На ваш счёт зачислено ${money} ${client.emoji.fish}`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		
		
		
		if(whattoDo == "снять"){
			var money = interaction.options.getInteger('сумма');
			if(money < 1)
				return interaction.reply({content: `Укажите корректное количество ${client.emoji.fish}`, ephemeral: true})
			if(userdb.balance_bank < money)
				return interaction.reply({content: `У вас недостаточно средств.`, ephemeral: true})
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_bank - money))
			client.db.changeUser(interaction.member.user.id, 'balance_bank', (userdb.balance_fish + money))
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Транзакция')
				.setDescription(`Успешно! Вы сняли ${money} ${client.emoji.fish} с вашего счёта.`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		
		

		if(whattoDo == "ограбить"){
			function randomBank(min, max) {
				let rand = min - 0.5 + Math.random() * (max - min + 1);
				return Math.round(rand);
			}
			var generatedCode = "";
			let firstNumber = randomBank(1, 9);
			generatedCode += firstNumber;
			let secondNumber = randomBank(1, 9);
			generatedCode += secondNumber;
			let thirdNumber = randomBank(1, 9);
			generatedCode += thirdNumber;
			let fourthNumber = randomBank(1, 5);
			if(fourthNumber == 1)
				var guessNumber = "1"
			else if(fourthNumber == 2)
				var guessNumber = "2"
			else if(fourthNumber == 3)
				var guessNumber = "3"
			else if(fourthNumber == 4)
				var guessNumber = "4"
			else if(fourthNumber == 5)
				var guessNumber = "5"
			generatedCode += "[]"
			let fiveNumber = randomBank(1, 9);
			generatedCode += fiveNumber;
			let robberyEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Банк: ограбление')
				.setDescription(`Вы подошли к хранилищу банка и достали кусок бумаги, купленный в DarkCat.
				\`${generatedCode}\`
				Угадайте цифру кода.`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			interaction.reply({embeds: [robberyEmbed]})
			let response;
			try {
				response = await channel.awaitMessages((message2) => interaction.member.user.id === message2.author.id, {
					max: 1,
					time: 60000,
					errors: ['time']
				});
			}catch(error){
				let failEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Банк: ограбление')
					.setDescription(`Сработала сигнализация! Вы смогли убежать от охраны этого банка.`)
					.setTimestamp()
					.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
				return interaction.editReply({embeds: [failEmbed]})
			}
			if(response.first().content == 1 || response.first().content == 2 || response.first().content == 3 || response.first().content == 4 || response.first().content == 5){
				if (response.first().content === `${guessNumber}`) {
					let reward = randomBank(150, 200);
					userdb = await client.db.getUser(interaction.member.user.id)
					client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + reward))
					let successEmbed = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Банк: ограбление`)
						.setDescription(`Код введён. Хранилище открылось! Вы забрали ${reward} ${client.emoji.fish}`)
						.setTimestamp()
						.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
					return interaction.editReply({embeds: [successEmbed]})
				} else {
					let failEmbed = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle('Банк: ограбление')
						.setDescription(`Код введён. Сработала сигнализация! Вы смогли убежать от охраны этого банка.`)
						.setTimestamp()
						.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
					return interaction.editReply({embeds: [failEmbed]})
				}
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