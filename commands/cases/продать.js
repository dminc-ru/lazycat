const Command = require('../../class/Command')
class Sell extends Command {
	constructor(client) {
		super(client, {
			name: 'продать',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: false
		})
	}

	async run (client, interaction) {
		try {
			let inventory = client.json.inventory;
			let cases = client.json.cases;
			let noUser = client.utils.error('Пользователь не найден в базе данных.')
			try {
				var user = await client.users.fetch(interaction.member.user.id);
			} catch (error) {
				return interaction.reply({embeds: [noUser], ephemeral: true})
			}
			let userdb = await client.db.getUser(interaction.member.user.id)
			var whattoDo = interaction.options.getSubcommand()
			let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
			let fishsell = 0;
			var totalsum = 0;
			let bugsell = 0;
			if(comlength < 1) {
				return interaction.reply({content: `Ваш инвентарь пуст.`, ephemeral: true})
			}
			switch (whattoDo) {
				case 'класс': {
					let classs = interaction.options.getString('класс');
					for(var i = 0; i<comlength; i++){
						if(!inventory[interaction.member.user.id].items[i]) break;
						if(inventory[interaction.member.user.id].items[i].itemclass == classs){
							let price = inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
							if (inventory[interaction.member.user.id].items[i].currency == client.emoji.fish) {
								fishsell += price
							} else {
								bugsell += price
							}
							totalsum += Number(inventory[interaction.member.user.id].items[i].county);
							inventory[interaction.member.user.id].items.splice(i, 1);
							await client.saveJSON('inventory', inventory)
						}
					}
					if (totalsum == 0) {
						interaction.reply({content: `Предметов с такой редкостью не найдено.`, ephemeral: true})
						break;
					}
					client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + fishsell))
					let successEmbed = client.utils.success(undefined, user)
						.addField(`Продано предметов:`, `${totalsum}`, false)
						.addField(`Заработано рыбок:`, `${fishsell} ${client.emoji.fish}`, true)
					if (fishsell > 0) {
						successEmbed.addField(`Заработано рыбок:`, `${fishsell} ${client.emoji.fish}`, true)
						client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + fishsell))
					}
					if (bugsell > 0) {
						successEmbed.addField(`Заработано жучков:`, `${bugsell} ${client.emoji.bug}`, true)
						client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs + bugsell))
					}
					interaction.reply({embeds: [successEmbed]})
					break;
				}
				case 'всё': {
					for(var i = 0; i<comlength; i++){
						let price = inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
						if (inventory[interaction.member.user.id].items[i].currency == client.emoji.fish) {
							fishsell += price
						} else {
							bugsell += price
						}
						totalsum += inventory[interaction.member.user.id].items[i].county;
					}
					let tosell = comlength + 1;
					inventory[interaction.member.user.id].items.splice(0, tosell);
					await client.saveJSON('inventory', inventory)
					let successEmbed = client.utils.success(undefined, user)
						.addField(`Продано предметов:`, `${totalsum}`, false)
					let factfish = 0
					if (fishsell > 0) {
						client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + fishsell))
						factfish += fishsell
						successEmbed.addField(`Заработано рыбок:`, `${fishsell} ${client.emoji.fish}`, true)
					}
					if (bugsell > 0) {
						client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs + bugsell))
						factfish += bugsell * 100
						successEmbed.addField(`Заработано жучков:`, `${bugsell} ${client.emoji.bug}`, true)
					}
					let factzar = factfish - userdb.case_open;
					successEmbed.addField(`Фактический заработок:`, `${factzar} ${client.emoji.fish}`, false)
					client.db.changeUser(interaction.member.user.id, 'case_open', 0)
					await interaction.reply({embeds: [successEmbed]})
					break;
				}
				case 'номер': {
					let uid = interaction.options.getInteger('номер') - 1;
					if (uid < 0) {
						interaction.reply({content: `Укажите корректный номер предмета.`, ephemeral: true})
						break
					}
					if (!inventory[interaction.member.user.id].items[uid]) {
						interaction.reply({content: `Предмет с этим номером не найден.`, ephemeral: true})
						break
					}
					if(inventory[interaction.member.user.id].items[uid].currency == client.emoji.fish){
						client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + inventory[interaction.member.user.id].items[uid].cost))
						var selledEmbed = client.utils.success(`Вы продали ${inventory[interaction.member.user.id].items[uid].itemname} за ${inventory[interaction.member.user.id].items[uid].cost} ${inventory[interaction.member.user.id].items[uid].currency}`, user)
						if(inventory[interaction.member.user.id].items[uid].county > 1){
							inventory[interaction.member.user.id].items[uid].county -= 1;
							let caseIDcase = inventory[interaction.member.user.id].items[uid].IDcase;
							client.db.changeUser(interaction.member.user.id, 'case_open', (userdb.case_open - cases[caseIDcase].cost * 120))
						}else{
							let caseIDcase = inventory[interaction.member.user.id].items[uid].IDcase;
							inventory[interaction.member.user.id].items.splice(uid, 1);
							client.db.changeUser(interaction.member.user.id, 'case_open', (userdb.case_open - cases[caseIDcase].cost * 120))
							await client.saveJSON('inventory', inventory)
						}
					}else{
					if(inventory[interaction.member.user.id].items[uid].currency == client.emoji.bug){
						var selledEmbed = client.utils.success(`Вы продали ${inventory[interaction.member.user.id].items[uid].itemname} за ${inventory[interaction.member.user.id].items[uid].cost} ${inventory[interaction.member.user.id].items[uid].currency}`, user)
						client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs + inventory[interaction.member.user.id].items[uid].cost))
						if(inventory[interaction.member.user.id].items[uid].county > 1){
							inventory[interaction.member.user.id].items[uid].county -= 1;
						}else{
							inventory[interaction.member.user.id].items.splice(uid, 1);
							await client.saveJSON('inventory', inventory)
						}
					};
					}
					await interaction.reply({embeds: [selledEmbed]})
					break
				}
				default: {
					interaction.reply({content: `Произошла ошибка при выполнении команды: некорректный запрос.`, ephemeral: true})
					break
				}
			}
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Sell;