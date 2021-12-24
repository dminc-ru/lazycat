const ms = require("ms");
var fs = require('fs');
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	let inventory = require(`${client.config.jsonPath}inventory.json`);
	let shop = require(`${client.config.jsonPath}shop.json`);
	let cases = require(`${client.config.jsonPath}cases.json`);
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
	if(whattoDo == "ежедн"){
		if(Date.now() > Number(userdb.reward_daily)){
			let razn = Date.now() - Number(userdb.reward_daily);
			if(razn > 86400000){
				let newTime = String(Date.now() + 86400000);
				client.db.changeUser(interaction.member.user.id, 'reward_daily', newTime)
				client.db.changeUser(interaction.member.user.id, 'reward_dayStrike', '1')
			}else{
				let newTime = String(Date.now() + 86400000);
				client.db.changeUser(interaction.member.user.id, 'reward_daily', newTime)
			}
		}else{
			let razn = Number(userdb.reward_daily) - Date.now();
			return interaction.reply({content: `Вы уже получили ежедневную награду, приходите через ${ms(razn)}`, ephemeral: true})
		}
		if(userdb.reward_dayStrike == '1'){
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + 10))
			client.db.changeUser(interaction.member.user.id, 'reward_dayStrike', '2')
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Успешно`)
				.setDescription(`Вы получили ежедневную награду — 10 ${client.emoji.fish}`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_dayStrike == '2'){
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + 20))
			client.db.changeUser(interaction.member.user.id, 'reward_dayStrike', '3')
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Успешно`)
				.setDescription(`Вы получили ежедневную награду — 20 ${client.emoji.fish}`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_dayStrike == '3'){
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + 40))
			client.db.change(interaction.member.user.id, 'users', 'reward_dayStrike', '4')
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы получили ежедневную награду — 40 ${client.emoji.fish}`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_dayStrike == '4'){
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + 80))
			client.db.changeUser(interaction.member.user.id, 'reward_dayStrike', '5')
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы получили ежедневную награду — 80 ${client.emoji.fish}`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_dayStrike == '5'){
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + 160))
			client.db.changeUser(interaction.member.user.id, 'reward_dayStrike', '6')
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы получили ежедневную награду — 160 ${client.emoji.fish}`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_dayStrike == '6'){
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + 320))
			client.db.changeUser(interaction.member.user.id, 'reward_dayStrike', '7')
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы получили ежедневную награду — 320 ${client.emoji.fish}`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_dayStrike == '7'){
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + 640))
			client.db.changeUser(interaction.member.user.id, 'reward_dayStrike', '1')
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы получили ежедневную награду — 640 ${client.emoji.fish}`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
	}

	if(whattoDo == "еженед"){
		if(Date.now() > Number(userdb.reward_weekly)){
			let razn = Date.now() - Number(userdb.reward_weekly);
			if(razn > 86400000){
				let newTime = String(Date.now() + 604800000);
				client.db.changeUser(interaction.member.user.id, 'reward_weekly', newTime)
				client.db.changeUser(interaction.member.user.id, 'reward_weekStrike', '1')
			}else{
				let newTime = String(Date.now() + 604800000);
				client.db.changeUser(interaction.member.user.id, 'reward_weekly', newTime)
			}
		}else{
			let razn = Number(userdb.reward_weekly) - Date.now();
			return interaction.reply({content: `Вы уже получили еженедельную награду, приходите через ${ms(razn)}`, ephemeral: true})
		}
		if(userdb.reward_weekStrike == '1'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 3;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.changeUser(interaction.member.user.id, 'reward_weekStrike', '2')
			fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы получили еженедельную награду — 3 мегакейса.`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_weekStrike == '2'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 4;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.changeUser(interaction.member.user.id, 'reward_weekStrike', '3')
			fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы уже получили еженедельную награду — 4 мегакейса.`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_weekStrike == '3'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 5;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.changeUser(interaction.member.user.id, 'reward_weekStrike', '4')
			fs.writeFileSync(`${client.emoji.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы получили еженедельную награду — 5 мегакейсов.`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_weekStrike == '4'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 6;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.changeUser(interaction.member.user.id, 'reward_weekStrike', '5')
			fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы получили еженедельную награду — 6 мегакейсов.`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_weekStrike == '5'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 7;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.changeUser(interaction.member.user.id, 'reward_weekStrike', '6')
			fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы получили еженедельную награду — 7 мегакейсов`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_weekStrike == '6'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 8;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.changeUser(interaction.member.user.id, 'reward_weekStrike', '7')
			fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Успешно`)
				.setDescription(`Вы получили еженедельную награду — 8 мегакейсов.`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}
		if(userdb.reward_weekStrike == '7'){
			let random = Math.round(Math.random(0, 1));
			let random2 = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 10;
			let numbers2 = Number(inventory[interaction.member.user.id].cases[random2].luckyCount) + 10;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			inventory[interaction.member.user.id].cases[random2].luckyCount = numbers2.toString();
			client.db.changeUser(interaction.member.user.id, 'reward_weekStrike', '1')
			fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Успешно')
				.setDescription(`Вы получили еженедельную награду — 10 мегакейсов и 10 лакикейсов`)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}	
	}

	if(whattoDo == "кейс"){
		var IDcase = interaction.options.getInteger('номер') - 1;
		if(interaction.data.options[0].options.length < 2)
			var count = 1;
		else
			var count = interaction.options.getInteger('количество');
		if(IDcase < 1)
			return interaction.reply({content: 'Укажите корректный номер кейса.', ephemeral: true})
		if(count < 1)
			return interaction.reply({content: 'Укажите корректное количество кейсов', ephemeral: true})
		if(!cases[IDcase])
			return interaction.reply({content: 'Укажите корректный номер кейса.', ephemeral: true})
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
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [successEmbed]})
		}else{
			return interaction.reply({content: 'У вас недостаточно жучков.', ephemeral: true})
		}
	}

	if(whattoDo == "витрина"){
			let itemID = interaction.options.getInteger('номер') - 1;
			if(itemID < 0 || itemID > 1){
				return interaction.reply({content: 'Укажите корректный номер предмета на витрине.', ephemeral: true})
			}
			if(itemID == 0){
				if(userdb.shop_first == true){
					return interaction.reply({content: 'Вы уже покупали этот предмет, приходите позже!', ephemeral: true})
				}
			}
			if(itemID == 1){
				if(userdb.shop_second == true){
					return interaction.reply({content: 'Вы уже покупали этот предмет, прихожите позже!', ephemeral: true})
				}
			}
			if(shop[itemID].type == "megacase"){
				let newID = shop[itemID].uid.toString();
				let memIndex = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == newID));
				if(userdb.gt >= shop[itemID].cost){
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
						.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
					return interaction.reply({embeds: [successEmbed]})
				}else{
					return interaction.reply({content: 'У вас недостаточно жучков.', ephemeral: true})
				}
			}
			if(shop[itemID].type == "luckycase"){
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
					return interaction.reply({embeds: [successEmbed]})
				}else{
					return interaction.reply({content: 'У вас недостаточно жучков.', ephemeral: true})
				}
			}
			if(shop[itemID].type == "item"){
				let newID = shop[itemID].uid;
				let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
				var checks;
				if(userdb.balance_fish >= shop[itemID].cost){
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
					resclass = cases[1].items[newID].class;
				}
				if(cases[1].items[newID].class == 'Стандартный'){
					resheart = client.emoji.bh;
					resclass = cases[1].items[newID].class;
				}
				if(!checks){
					inventory[interaction.member.user.id].items.push({
						itemname: cases[1].items[newID].name,
						description: cases[1].items[newID].description,
						itemclass: cases[1].items[newID].class,
						textItemclass: resclass,
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
					.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
				return interaction.reply({embeds: [successEmbed]})
				}else{
					return interaction.reply({content: 'У вас недостаточно жучков.', ephemeral: true})
				}
			}
			if(shop[itemID].type == "money"){
				if(userdb.balance_fish >= shop[itemID].cost){
					if(itemID == 0){
						client.db.changeUser(interaction.member.user.id, 'shop_first', 1)
					}
					if(itemID == 1){
						client.db.changeUser(interaction.member.user.id, 'shop_second', 1)
					}
				client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs + 1))
				client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_bugs - shop[itemID].cost))
				let successEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle('Успешно')
					.setDescription(`Успешная покупка: ${shop[itemID].name}.`)
					.setTimestamp()
					.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
				return interaction.reply({embeds: [successEmbed]})
				}else{
					return interaction.reply({content: 'У вас недостаточно жучков.', ephemeral: true})
				}
			}
	}
	if(whattoDo == "магазин"){
		let shopEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Магазин')
			.addField('Награды', `Ежедневная — ${dailyStatus}\nЕженедельная — ${weeklyStatus}`, false)
			.addField('Витрина', `1. ${shop[0].name} | ${shop[0].cost} ${shop[0].currency}
				2. ${shop[1].name} | ${shop[1].cost} ${shop[1].currency}`, false)
			.addField('Кейсы', `1. ${client.emoji.tree} Кейс садовника\n2. ${client.emoji.cmd} Школьная библиотека`, false)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [shopEmbed]})
	}
}

module.exports.data = {
	name: "магазин",
	permissions: ["member"],
	type: "interaction"
}