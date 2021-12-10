const math = require('math-expression-evaluator');
module.exports.run = async (client, interaction) => {
try{
	let user = client.users.cache.get(interaction.member.user.id);
	let userdb = await client.db.get(interaction.member.user.id, 'users')
	let channel = client.channels.cache.get(interaction.channel_id);
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
	await client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: 'Пример',
						description: `**${Number(firstNumber) < 0 ? `(${firstNumber})` : firstNumber} ${signs[sign]} ${Number(secondNumber) < 0 ? `(${secondNumber})` : secondNumber}**`,
						timestamp: new Date(),
						footer: {
							text: `${user.tag} • На размышление 1 минута. Отправьте сообщение только с числом.`,
							icon_url: `${user.displayAvatarURL()}`,
						}
					}
				]
			}
		}
	});
	let response;
	try {
		response = await channel.awaitMessages((message2) => interaction.member.user.id === message2.author.id, {
			max: 1,
			time: 60000,
			errors: ['time']
		});
	}
	catch (error){
		client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish - 30))
		return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
			data: {
				type: 4,
			  	embeds: [{
					color: 0xb88fff,
					title: "Пример: ошибка",
					description: `Время истекло. Списано 30 <:lz_fish:742459590087803010>. Новый пример: /пример`,
					timestamp: new Date(),
					footer: {
						text: `${user.tag}`,
						icon_url: `${user.displayAvatarURL()}`,
					}
			  	}]
			}
		});
	}
	const mathCalculation = await math.eval(`${firstNumber} ${signs[sign]} ${secondNumber}`);
	function randomMath(min, max) {
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}
	if (mathCalculation === Number(response.first().content)) {
		let wonPrize = randomMath(25, 50);
		if(userdb.math_level < 250000)
			client.db.change(interaction.member.user.id, 'users', 'math_level', (userdb.mathlevel + 1))
		client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + wonPrize))
		return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
			data: {
				type: 4,
			  	embeds: [{
					color: 0xb88fff,
					title: "Пример: успешно",
					description: `Правильное решение! Ты заработал ${wonPrize} <:lz_fish:742459590087803010>`,
					timestamp: new Date(),
					footer: {
						text: `${user.tag}`,
						icon_url: `${user.displayAvatarURL()}`,
					}
			  	}]
			}
		});
	}
	else{
		if(userdb.balance_fish > 30){
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish - 30))
		}
		return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
			data: {
				type: 4,
			  	embeds: [{
					color: 0xb88fff,
					title: "Пример: ошибка",
					description: `Неправильное решение. Списано 30 <:lz_fish:742459590087803010>. Новый пример: /пример`,
					timestamp: new Date(),
					footer: {
						text: `${user.tag}`,
						icon_url: `${user.displayAvatarURL()}`,
					}
			  	}]
			}
		});
	}
}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "пример",
	aliases: ["ghbvth"],
	permissions: ["member"],
	modules: ["entertainment"]
}