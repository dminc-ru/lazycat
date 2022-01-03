const math = require('math-expression-evaluator');
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		let noUser = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Ошибка')
			.setDescription('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return message.channel.send({embeds: [noUser]})
		}
		let userdb = await client.db.getUser(interaction.member.user.id)
		let firstNumber;
		let secondNumber;
		firstNumber = Math.floor(Math.random() * 10);
		firstNumber *= Math.floor(userdb.math_level / 2);
		firstNumber += Math.floor(userdb.math_level / 5);
		secondNumber = Math.floor(Math.random() * 10) + Math.floor(userdb.math_level / 5);
		secondNumber *= Math.floor(userdb.math_level / 2);
		secondNumber += Math.floor(userdb.math_level / 5);
		const signs = ['+', '-', '*'];
		const sign = Math.floor(Math.random() * signs.length);
		let problemEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Пример')
			.setDescription(`**${Number(firstNumber) < 0 ? `(${firstNumber})` : firstNumber} ${signs[sign]} ${Number(secondNumber) < 0 ? `(${secondNumber})` : secondNumber}**`)
			.setTimestamp()
			.setFooter({ text: `${user.tag} • На размышление 1 минута. Отправьте сообщение только с числом.`, iconURL: user.displayAvatarURL({dynamic: true}) })
		await interaction.reply({embeds: [problemEmbed]})
		let response;
		const filter = message => message.author.id === interaction.member.user.id;
		const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });
		var answered = false;
		const mathCalculation = await math.eval(`${firstNumber} ${signs[sign]} ${secondNumber}`);
		function randomMath(min, max) {
			let rand = min - 0.5 + Math.random() * (max - min + 1);
			return Math.round(rand);
		}
		collector.on('collect', async m => {
			if (mathCalculation === Number(m.content)) {
				let wonPrize = randomMath(25, 50);
				if(userdb.math_level < 250000)
					client.db.changeUser(interaction.member.user.id, 'math_level', (userdb.math_level + 1))
				client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + wonPrize))
				let winEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Пример: успешно')
					.setDescription(`Правильное решение! Ты заработал ${wonPrize} ${client.emoji.fish}`)
					.setTimestamp()
					.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
				interaction.editReply({embeds: [winEmbed]})
			}
			else{
				if(userdb.balance_fish > 30){
					client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - 30))
				}
				let errorEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Пример: ошибка')
					.setDescription(`Неправильное решение. Списано 30 ${client.emoji.fish}. Новый пример: /пример`)
					.setTimestamp()
					.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
				interaction.editReply({embeds: [errorEmbed]})
			}
			answered = true
			return collector.stop()
		})
		collector.on('end', collected => {
			if (!answered) {
				client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - 30))
				client.db.changeUser(interaction.member.user.id, 'math_level', (userdb.math_level - 1))
				let timeOut = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Пример: ошибка')
					.setDescription(`Время истекло. Списано 30 ${client.emoji.fish}. Новый пример: /пример`)
					.setTimestamp()
					.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
				return interaction.editReply({embeds: [timeOut]})
			} else {
				return
			}
		})
		
	} catch (error) {
		client.logger.log(error)
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "пример",
	permissions: ["member"],
	type: "interaction"
}