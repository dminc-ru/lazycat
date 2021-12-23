const fs = require("fs");
module.exports.run = async (client, interaction) => {
		let exchange = require(`${client.config.jsonPath}exchange.json`);
		let user = await client.users.fetch(interaction.member.user.id);
		let userdb = await client.db.getUser(interaction.member.user.id);
		var whattoDo = interaction.data.options[0].name;
		if(bugs < 1)
			return interaction.reply({content: `Укажите корректное количество ${client.emoji.bug}`, ephemeral: true})
		if(userdb.balance_fish < count)
			return interaction.reply({content: `У вас недостаточно средств.`, ephemeral: true})
		if(whattoDo == "купить"){
			userdb = await client.db.getUser(interaction.member.user.id)	
			let clientdb = await client.db.getUser(client.user.id)

			var bugs = interaction.data.options[0].options[0].value;
			var count = bugs * exchange.currentBugPrice; 

			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - count))
			client.db.changeUser(client.user.id, 'balance_fish', (clientdb.balance_fish + count))
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_bugs + bugs))
			exchange.boughtBugs += bugs;
			fs.writeFileSync(`${client.config.jsonPath}exchange.json`, JSON.stringify(exchange, null, "\t"));
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Транзакция`)
				.setDescription(`Успешно! Куплено ${bugs} ${client.emoji.bug} за ${count} ${client.emoji.fish}`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(whattoDo == "продать"){
			userdb = await client.db.getUser(interaction.member.user.id)
			let clientdb = await client.db.getUser(client.user.id)

			var bugs = interaction.data.options[0].options[0].value;
			var count = bugs * exchange.currentBugPrice; 

			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_bugs - bugs))
			client.db.changeUser(client.user.id, 'balance_fish', (clientdb.balance_bugs + bugs))
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + count))
			exchange.sellBugs += bugs;
			fs.writeFileSync(`${client.config.jsonPath}exchange.json`, JSON.stringify(exchange, null, "\t"));
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Транзакция`)
				.setDescription(`Успешно! Продано ${bugs} ${client.emoji.bug} за ${count} ${client.emoji.fish}`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(whattoDo == "курс"){
			let exchangeEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Жучки`)
				.setDescription(`Текущий курс обмена жучков:
					1 ${client.emoji.bug} = ${exchange.currentBugPrice} ${client.emoji.fish}

					/жучки купить <кол-во>
					/жучки продать <кол-во>`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [exchangeEmbed]})
		}
}

module.exports.data = {
	name: "жучки",
	permissions: ["member"],
	type: "interaction"
}