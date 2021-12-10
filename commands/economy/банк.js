module.exports.run = async (client, interaction) => {
	try{
		let userdb = await client.db.get(interaction.member.user.id, 'users')
		let user = client.users.cache.get(interaction.member.user.id);
		let channel = client.channels.cache.get(interaction.channel_id);
		var whattoDo = interaction.data.options[0].name;	
		if(whattoDo == "положить"){
			var money = interaction.data.options[0].options[0].value;
			if(money < 1)
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Укажите корректное количество <:lz_fish:742459590087803010>`
					}
				}
			});
			if(userdb.balance_fish < money)
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `У вас недостаточно средств.`
					}
				}
			});
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish - money))
			client.db.change(interaction.member.user.id, 'users', 'balance_bank', (userdb.balance_bank + money))

			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Транзакция',
								description: `Успешно! На ваш счёт зачислено ${money} <:lz_fish:742459590087803010>.`,
								timestamp: new Date(),
								footer: {
									text: `${user.tag}`,
									icon_url: `${user.displayAvatarURL()}`,
								}
							}
						]
					}
				}
			});
		}
		
		
		
		if(whattoDo == "снять"){
			var money = interaction.data.options[0].options[0].value;
			if(money < 1)
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Укажите корректное количество <:lz_fish:742459590087803010>`
					}
				}
			});
			if(userdb.balance_bank < money)
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `У вас недостаточно средств.`
					}
				}
			});
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_bank - money))
			client.db.change(interaction.member.user.id, 'users', 'balance_bank', (userdb.balance_fish + money))

			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Транзакция',
								description: `Успешно! Вы сняли ${money} <:lz_fish:742459590087803010> с вашего счёта.`,
								timestamp: new Date(),
								footer: {
									text: `${user.tag}`,
									icon_url: `${user.displayAvatarURL()}`,
								}
							}
						]
					}
				}
			});
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
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [{
							color: 0xb88fff,
							title: "Банк: ограбление",
							description: `Вы подошли к хранилищу банка и достали кусок бумаги, купленный в DarkCat.\n\`${generatedCode}\`\nУгадайте цифру кода.`,
							timestamp: new Date(),
							footer: {
								text: `${user.tag}`,
								icon_url: `${user.displayAvatarURL()}`,
							}
						}]
						
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
			}catch(error){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [{
								color: 0xb88fff,
								title: 'Банк: ограбление',
								description: `Сработала сигнализация! Вы смогли убежать от охраны этого банка.`,
								timestamp: new Date(),
								footer: {
									text: `${user.tag}`,
									icon_url: `${user.displayAvatarURL()}`,
								}
							}]
						}
					}
				});
			}
			if(response.first().content == 1 || response.first().content == 2 || response.first().content == 3 || response.first().content == 4 || response.first().content == 5){
				if (response.first().content === `${guessNumber}`) {
					let reward = randomBank(150, 200);
					userdb = await client.db.get(interaction.member.user.id, 'users')
					client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + reward))
					return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
						data: {
							type: 4,
						  	embeds: [{
								color: 0xb88fff,
								title: 'Банк: ограбление',
								description: `Код введён. Хранилище открылось! Вы забрали ${reward} <:lz_fish:742459590087803010>`,
								timestamp: new Date(),
								footer: {
									text: `${user.tag}`,
									icon_url: `${user.displayAvatarURL()}`,
								}
						 	}]
						}
					  });
				} else {
					return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
						data: {
							type: 4,
						  	embeds: [{
								color: 0xb88fff,
								title: 'Банк: ограбление',
								description: `Код введён. Сработала сигнализация! Вы смогли убежать от охраны этого банка.`,
								timestamp: new Date(),
								footer: {
									text: `${user.tag}`,
									icon_url: `${user.displayAvatarURL()}`,
								}
						 	}]
						}
					  });
				}
			}				
		}
	}catch(error){
		client.logger.log(`${error}`, "err");
	}
}
module.exports.help = {
	name: "банк",
	aliases: [",fyr"],
	permissions: ["member"],
	modules: ["economy"]
}