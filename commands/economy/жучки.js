const Command = require('../../class/Command')
class Bugs extends Command {
	constructor(client) {
		super(client, {
			name: 'жучки',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: false
		})
	}

	async run (client, interaction) {
		try {
			let exchange = client.json.exchange
			let noUser = client.utils.error('Пользователь не найден в базе данных.')
			try {
				var user = await client.users.fetch(interaction.member.user.id);
			} catch (error) {
				return interaction.reply({embeds: [noUser], ephemeral: true})
			}
			let userdb = await client.db.getUser(interaction.member.user.id);
			var whattoDo = interaction.options.getSubcommand();
			if(bugs < 1)
				return interaction.reply({content: `Укажите корректное количество ${client.emoji.bug}`, ephemeral: true})
			switch (whattoDo) {
				case 'купить': {
					userdb = await client.db.getUser(interaction.member.user.id)	
					let clientdb = await client.db.getUser(client.user.id)
	
					var bugs = interaction.options.getInteger('количество');
					var count = bugs * exchange.currentBugPrice; 
					if(userdb.balance_fish < count)
						return interaction.reply({content: `У вас недостаточно средств.`, ephemeral: true})
					client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - count))
					client.db.changeUser(client.user.id, 'balance_fish', (clientdb.balance_fish + count))
					client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs + bugs))
					exchange.boughtBugs += bugs;
					await client.saveJSON('exchange', exchange)
					let successEmbed = client.utils.success(`Успешно! Куплено ${bugs} ${client.emoji.bug} за ${count} ${client.emoji.fish}`, user)
					interaction.reply({embeds: [successEmbed]});
					break;
				}
				case 'продать': {
					userdb = await client.db.getUser(interaction.member.user.id)
					let clientdb = await client.db.getUser(client.user.id)
	
					var bugs = interaction.options.getInteger('количество');
					var count = bugs * exchange.currentBugPrice; 
					if(userdb.balance_bugs < bugs)
						return interaction.reply({content: `У вас недостаточно средств.`, ephemeral: true})
					client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs - bugs))
					client.db.changeUser(client.user.id, 'balance_bugs', (clientdb.balance_bugs + bugs))
					client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + count))
					exchange.sellBugs += bugs;
					await client.saveJSON('exchange', exchange)
					let successEmbed = client.utils.success(`Успешно! Продано ${bugs} ${client.emoji.bug} за ${count} ${client.emoji.fish}`, user)
					interaction.reply({embeds: [successEmbed]})
					break;
				}
				case 'курс': {
					let exchangeEmbed = client.utils.embed(
						'Жучки', 
						`Текущий курс обмена жучков:
						1 ${client.emoji.bug} = ${exchange.currentBugPrice} ${client.emoji.fish}
		
						/жучки купить <кол-во>
						/жучки продать <кол-во>`, user)
					interaction.reply({embeds: [exchangeEmbed]})
					break
				}
				default: break;
			}
		} catch(error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Bugs;