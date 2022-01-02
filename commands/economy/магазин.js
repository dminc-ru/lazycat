const ms = require("ms");
var fs = require('fs');
const { MessageEmbed, UserContextMenuInteraction } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		let inventory = require(`${client.config.jsonPath}inventory.json`);
		let shop = require(`${client.config.jsonPath}shop.json`);
		let cases = require(`${client.config.jsonPath}cases.json`);
		let daystrike = require(`${client.config.jsonPath}daystrike.json`);
		let weekstrike = require(`${client.config.jsonPath}weekstrike.json`);
		var whattoDo = interaction.options.getSubcommand();
		let noUser = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Ошибка')
			.setDescription('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return interaction.reply({embeds: [noUser], ephemeral: true})
		}
		let userdb = await client.db.getUser(interaction.member.user.id)
		if(Date.now() > Number(userdb.reward_daily)){
			var dailyStatus = `доступна!`;
		}else{
			let razn = Number(userdb.reward_daily) - Date.now();
			var dailyStatus = `${ms(razn)} осталось`;
		}
		if(Date.now() > Number(userdb.reward_weekly)){
			var weeklyStatus = `доступна!`;
		}else{
			let razn = Number(userdb.reward_weekly) - Date.now();
			var weeklyStatus = `${ms(razn)} осталось`;
		}
		switch (whattoDo) {
			case 'ежедн': {
				if(Date.now() > Number(userdb.reward_daily)){
					let razn = Date.now() - Number(userdb.reward_daily);
					if(razn > 86400000){
						let newTime = String(Date.now() + 86400000);
						client.db.changeUser(interaction.member.user.id, 'reward_daily', newTime)
						client.db.changeUser(interaction.member.user.id, 'reward_dayStrike', '1')
						userdb = await client.db.getUser(interaction.member.user.id)
					}else{
						let newTime = String(Date.now() + 86400000);
						client.db.changeUser(interaction.member.user.id, 'reward_daily', newTime)
						userdb = await client.db.getUser(interaction.member.user.id)
					}
				}else{
					let razn = Number(userdb.reward_daily) - Date.now();
					interaction.reply({content: `Вы уже получили ежедневную награду, приходите через ${ms(razn)}`, ephemeral: true})
					break
				}
				let reward = daystrike.find(day => day.dayStrike == userdb.reward_dayStrike)
				client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + reward.count))
				client.db.changeUser(interaction.member.user.id, 'reward_dayStrike', (userdb.reward_dayStrike + 1))
				let successEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Успешно`)
					.setDescription(`Вы получили ежедневную награду — ${reward.count} ${client.emoji.fish}`)
					.setTimestamp()
					.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
				interaction.reply({embeds: [successEmbed]})
				break
			}
			case 'еженед': {
				if(Date.now() > Number(userdb.reward_weekly)){
					let razn = Date.now() - Number(userdb.reward_weekly);
					if(razn > 86400000){
						let newTime = String(Date.now() + 604800000);
						client.db.changeUser(interaction.member.user.id, 'reward_weekly', newTime)
						client.db.changeUser(interaction.member.user.id, 'reward_weekStrike', '1')
						userdb = await client.db.getUser(interaction.member.user.id)
					}else{
						let newTime = String(Date.now() + 604800000);
						client.db.changeUser(interaction.member.user.id, 'reward_weekly', newTime)
						userdb = await client.db.getUser(interaction.member.user.id)
					}
				}else{
					let razn = Number(userdb.reward_weekly) - Date.now();
					interaction.reply({content: `Вы уже получили еженедельную награду, приходите через ${ms(razn)}`, ephemeral: true})
					break
				}
				let reward = weekstrike.find(week => week.weekStrike == userdb.reward_weekStrike)
				let random = Math.round(Math.random(0, 1));
				let random2 = Math.round(Math.random(0, 1));
				let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + reward.megaCase;
				let numbers2 = Number(inventory[interaction.member.user.id].cases[random2].luckyCount) + reward.luckyCase;
				inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
				inventory[interaction.member.user.id].cases[random2].luckyCount = numbers2.toString();
				client.db.changeUser(interaction.member.user.id, 'reward_weekStrike', (userdb.reward_weekStrike + 1))
				fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
				let successEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Успешно')
					.setDescription(`Вы получили еженедельную награду — ${(reward.megaCase > 0) ? `${reward.megaCase} мегакейсов` : ``} ${(reward.luckyCase > 0) ? `${reward.luckyCase} лакикейсов` : ``}`)
					.setTimestamp()
					.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
				interaction.reply({embeds: [successEmbed]})
				break
			}
			case 'кейс': {
				var IDcase = interaction.options.getInteger('номер');
				var count = interaction.options.getInteger('количество');
				if (!count) {
					count = 1
				}
				if (IDcase < 1 || !cases[IDcase]) {
					interaction.reply({content: 'Укажите корректный номер кейса.', ephemeral: true})
					break
				}
				if (count < 1) {
					interaction.reply({content: 'Укажите корректное количество кейсов', ephemeral: true})
					break
				}
				function declOfNum(n, text_forms) {  
					n = Math.abs(n) % 100; var n1 = n % 10;
					if (n > 10 && n < 20) { return text_forms[2]; }
					if (n1 > 1 && n1 < 5) { return text_forms[1]; }
					if (n1 == 1) { return text_forms[0]; }
					return text_forms[2];
				}
				let summa = cases[IDcase].cost * count;
				if(userdb.balance_bugs >= summa){
					let memIndex = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == IDcase));
					inventory[interaction.member.user.id].cases[memIndex].count += 1;
					client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs - summa))
					let fs = require('fs');
					fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
					let successEmbed = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle('Успешно')
						.setDescription(`Вы купили ${count} ${declOfNum(count, ['кейс', 'кейса', 'кейсов'])}`)
						.setTimestamp()
						.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
					interaction.reply({embeds: [successEmbed]})
					break
				}else{
					interaction.reply({content: 'У вас недостаточно жучков.', ephemeral: true})
					break
				}
			}
			case 'витрина': {
				let itemID = interaction.options.getInteger('номер') - 1;
				if(itemID < 0 || itemID > 1){
					interaction.reply({content: 'Укажите корректный номер предмета на витрине.', ephemeral: true})
					break
				}
				if(itemID == 0){
					if(userdb.shop_first == true){
						interaction.reply({content: 'Вы уже покупали этот предмет, приходите позже!', ephemeral: true})
						break
					}
				}
				if(itemID == 1){
					if(userdb.shop_second == true){
						interaction.reply({content: 'Вы уже покупали этот предмет, прихожите позже!', ephemeral: true})
						break
					}
				}
				switch(shop[itemID].type) {
					case 'megacase': {
						let newID = shop[itemID].uid.toString();
						let memIndex = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == newID));
						if(userdb.balance_bugs >= shop[itemID].cost){
							if(itemID == 0){
								client.db.changeUser(interaction.member.user.id, 'shop_first', 1)
							}
							if(itemID == 1){
								client.db.changeUser(interaction.member.user.id, 'shop_second', 1)
							}
							inventory[interaction.member.user.id].cases[memIndex].megaCount += 1;
							fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
							client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs - shop[itemID].cost))
							let successEmbed = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setTitle('Успешно')
								.setDescription(`Успешная покупка: ${shop[itemID].name}`)
								.setTimestamp()
								.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
							interaction.reply({embeds: [successEmbed]})
							break
						}else{
							interaction.reply({content: 'У вас недостаточно жучков.', ephemeral: true})
							break
						}
					}
					case 'luckycase': {
						let newID = shop[itemID].uid;
						let memIndex = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == newID));
						if(userdb.balance_bugs >= shop[itemID].cost){
							if(itemID == 0){
								client.db.changeUser(interaction.member.user.id, 'shop_first', 1)
							}
							if(itemID == 1){
								client.db.changeUser(interaction.member.user.id, 'shop_second', 1)
							}
							inventory[interaction.member.user.id].cases[memIndex].luckyCount += 1;
							fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
							client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs - shop[itemID].cost))
							let successEmbed = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setTitle('Успешно')
								.setDescription(`Успешная покупка: ${shop[itemID].name}.`)
								.setTimestamp()
								.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
							interaction.reply({embeds: [successEmbed]})
							break
						}else{
							interaction.reply({content: 'У вас недостаточно жучков.', ephemeral: true})
							break
						}
					}
					case 'item': {
						let newID = shop[itemID].uid;
						let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
						var checks;
						if (userdb.balance_fish >= shop[itemID].cost) {
							if(itemID == 0){
								client.db.changeUser(interaction.member.user.id, 'shop_first', 1)
							}
							if(itemID == 1){
								client.db.changeUser(interaction.member.user.id, 'shop_second', 1)
							}
							client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_bugs - shop[itemID].cost))
							for(var i = 0; i<comlength; i++){
								if(inventory[interaction.member.user.id].items[i].itemname == cases[1].items[newID].name){
									inventory[interaction.member.user.id].items[i].county += 1;
									let fs = require("fs");
									fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
									checks = true;
									break;
								}
								checks = false;
							}
							if(cases[1].items[newID].class == 'Обычный'){
								resheart = client.emoji.ph
							}
							else if(cases[1].items[newID].class == 'Стандартный'){
								resheart = client.emoji.bh;
							}
							if(!checks){
								inventory[interaction.member.user.id].items.push({
									itemname: cases[1].items[newID].name,
									description: cases[1].items[newID].description,
									itemclass: cases[1].items[newID].class,
									textItemclass: cases[1].items[newID].class,
									heart: resheart,
									cost: cases[1].items[newID].cost,
									currency: cases[1].items[newID].currency,
									type: cases[1].items[newID].type,
									purchase: cases[1].items[newID].purchase,
									county: 1,
									IDcase: 1
								});
								fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
							}
							let successEmbed = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setTitle('Успешно')
								.setDescription(`Успешная покупка: ${shop[itemID].name}.`)
								.setTimestamp()
								.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
							interaction.reply({embeds: [successEmbed]})
							break
						}else{
							interaction.reply({content: 'У вас недостаточно жучков.', ephemeral: true})
							break
						}
					}
					case 'money': {
						if(userdb.balance_fish >= shop[itemID].cost){
							if(itemID == 0){
								client.db.changeUser(interaction.member.user.id, 'shop_first', 1)
							}
							if(itemID == 1){
								client.db.changeUser(interaction.member.user.id, 'shop_second', 1)
							}
							client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs + 1))
							client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - shop[itemID].cost))
							let successEmbed = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setTitle('Успешно')
								.setDescription(`Успешная покупка: ${shop[itemID].name}.`)
								.setTimestamp()
								.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
							interaction.reply({embeds: [successEmbed]})
							break
						}else{
							interaction.reply({content: 'У вас недостаточно рыбок.', ephemeral: true})
							break
						}
					}
				}
			}
			case 'магазин': {
				let shopEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Магазин')
					.addField('Награды', `Ежедневная — ${dailyStatus}\nЕженедельная — ${weeklyStatus}`, false)
					.addField('Витрина', `1. ${shop[0].name} | ${shop[0].cost} ${shop[0].currency}
						2. ${shop[1].name} | ${shop[1].cost} ${shop[1].currency}`, false)
					.addField('Кейсы', `1. ${client.emoji.tree} Кейс садовника\n2. ${client.emoji.cmd} Школьная библиотека`, false)
					.setTimestamp()
					.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
				interaction.reply({embeds: [shopEmbed]})
				break
			}
		}
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "магазин",
	permissions: ["member"],
	type: "interaction"
}