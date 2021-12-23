const math = require('math-expression-evaluator');
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let userdb = await client.db.getUser(interaction.member.user.id)
	let channel = await client.channels.fetch(interaction.channel_id);
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
		.setFooter(`${user.tag} • На размышление 1 минута. Отправьте сообщение только с числом.`, user.displayAvatarURL({dynamic: true}))
	await interaction.reply({embeds: [problemEmbed]})
	let response;
	try {
		response = await channel.awaitMessages((message2) => interaction.member.user.id === message2.author.id, {
			max: 1,
			time: 60000,
			errors: ['time']
		});
	}
	catch (error){
		client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - 30))
		let timeOut = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Пример: ошибка')
			.setDescription(`Время истекло. Списано 30 ${client.emoji.fish}. Новый пример: /пример`)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.editReply({embeds: [timeOut]})
	}
	const mathCalculation = await math.eval(`${firstNumber} ${signs[sign]} ${secondNumber}`);
	function randomMath(min, max) {
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}
	if (mathCalculation === Number(response.first().content)) {
		let wonPrize = randomMath(25, 50);
		if(userdb.math_level < 250000)
			client.db.changeUser(interaction.member.user.id, 'math_level', (userdb.mathlevel + 1))
		client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + wonPrize))
		let winEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Пример: успешно')
			.setDescription(`Правильное решение! Ты заработал ${wonPrize} ${client.emoji.fish}`)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.editReply({embeds: [winEmbed]})
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
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.editReply({embeds: [errorEmbed]})
	}
}

module.exports.data = {
	name: "пример",
	permissions: ["member"],
	type: "interaction"
}