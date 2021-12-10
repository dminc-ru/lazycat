const ms = require("ms");
let fs = require('fs');
let inventory = require(`${process.env.PATHTOBASE}/inventory.json`);
let shop = require(`${process.env.PATHTOBASE}/shop.json`);
let cases = require(`${process.env.PATHTOBASE}/cases.json`);
module.exports.run = async (client, interaction) => {
try{
	var whattoDo = interaction.data.options[0].name;
	let user = client.users.cache.get(interaction.member.user.id);

	let userdb = await client.db.get(interaction.member.user.id, 'users')

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
				client.db.change(interaction.member.user.id, 'users', 'reward_daily', newTime)
				client.db.change(interaction.member.user.id, 'users', 'reward_dayStrike', '1')
			}else{
				let newTime = String(Date.now() + 86400000);
				client.db.change(interaction.member.user.id, 'users', 'reward_daily', newTime)
			}
		}else{
			let razn = Number(userdb.reward_daily) - Date.now();
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Вы уже получили ежедневную награду, приходите через ${ms(razn)}`
					}
				}
			});
		}
		if(userdb.reward_dayStrike == '1'){
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + 10))
			client.db.change(interaction.member.user.id, 'users', 'reward_dayStrike', '2')
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили ежедневную награду — 10 <:lz_fish:742459590087803010>`,
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
		if(userdb.reward_dayStrike == '2'){
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + 20))
			client.db.change(interaction.member.user.id, 'users', 'reward_dayStrike', '3')
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили ежедневную награду — 20 <:lz_fish:742459590087803010>`,
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
		if(userdb.reward_dayStrike == '3'){
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + 40))
			client.db.change(interaction.member.user.id, 'users', 'reward_dayStrike', '4')
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили ежедневную награду — 40 <:lz_fish:742459590087803010>`,
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
		if(userdb.reward_dayStrike == '4'){
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + 80))
			client.db.change(interaction.member.user.id, 'users', 'reward_dayStrike', '5')
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили ежедневную награду — 80 <:lz_fish:742459590087803010>`,
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
		if(userdb.reward_dayStrike == '5'){
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + 160))
			client.db.change(interaction.member.user.id, 'users', 'reward_dayStrike', '6')
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили ежедневную награду — 160 <:lz_fish:742459590087803010>`,
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
		if(userdb.reward_dayStrike == '6'){
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + 320))
			client.db.change(interaction.member.user.id, 'users', 'reward_dayStrike', '7')
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили ежедневную награду — 320 <:lz_fish:742459590087803010>`,
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
		if(userdb.reward_dayStrike == '7'){
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + 640))
			client.db.change(interaction.member.user.id, 'users', 'reward_dayStrike', '1')
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили ежедневную награду — 640 <:lz_fish:742459590087803010>`,
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
	}

	if(whattoDo == "еженед"){
		if(Date.now() > Number(userdb.reward_weekly)){
			let razn = Date.now() - Number(userdb.reward_weekly);
			if(razn > 86400000){
				let newTime = String(Date.now() + 604800000);
				client.db.change(interaction.member.user.id, 'users', 'reward_weekly', newTime)
				client.db.change(interaction.member.user.id, 'users', 'reward_weekStrike', '1')
			}else{
				let newTime = String(Date.now() + 604800000);
				client.db.change(interaction.member.user.id, 'users', 'reward_weekly', newTime)
			}
		}else{
			let razn = Number(userdb.reward_weekly) - Date.now();
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Вы уже получили еженедельную награду, приходите через ${ms(razn)}`
					}
				}
			});
		}
		if(userdb.reward_weekStrike == '1'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 3;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.change(interaction.member.user.id, 'users', 'reward_weekStrike', '2')
			fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили еженедельную награду — 3 мегакейса.`,
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
		if(userdb.reward_weekStrike == '2'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 4;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.change(interaction.member.user.id, 'users', 'reward_weekStrike', '3')
			fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили еженедельную награду — 4 мегакейса`,
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
		if(userdb.reward_weekStrike == '3'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 5;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.change(interaction.member.user.id, 'users', 'reward_weekStrike', '4')
			fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили еженедельную награду — 5 мегакейсов`,
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
		if(userdb.reward_weekStrike == '4'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 6;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.change(interaction.member.user.id, 'users', 'reward_weekStrike', '5')
			fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили еженедельную награду — 6 мегакейсов`,
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
		if(userdb.reward_weekStrike == '5'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 7;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.change(interaction.member.user.id, 'users', 'reward_weekStrike', '6')
			fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили еженедельную награду — 7 мегакейсов`,
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
		if(userdb.reward_weekStrike == '6'){
			let random = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 8;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			client.db.change(interaction.member.user.id, 'users', 'reward_weekStrike', '7')
			fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили еженедельную награду — 8 мегакейсов`,
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
		if(userdb.reward_weekStrike == '7'){
			let random = Math.round(Math.random(0, 1));
			let random2 = Math.round(Math.random(0, 1));
			let numbers = Number(inventory[interaction.member.user.id].cases[random].megaCount) + 10;
			let numbers2 = Number(inventory[interaction.member.user.id].cases[random2].luckyCount) + 10;
			inventory[interaction.member.user.id].cases[random].megaCount = numbers.toString();
			inventory[interaction.member.user.id].cases[random2].luckyCount = numbers2.toString();
			client.db.change(interaction.member.user.id, 'users', 'reward_weekStrike', '1')
			fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы получили еженедельную награду — 10 мегакейсов и 10 лакикейсов`,
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
	}

	if(whattoDo == "кейс"){
		var IDcase = Number(interaction.data.options[0].options[0].value);
		if(interaction.data.options[0].options.length < 2)
			var count = 1;
		else
			var count = interaction.data.options[0].options[1].value;
		if(IDcase < 1)
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Укажите корректный номер кейса.`
				}
			}
		});
		if(count < 1)
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Укажите корректное количество кейсов`
				}
			}
		});
		if(!cases[IDcase])
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Укажите корректный номер кейса.`
				}
			}
		});
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
			client.db.change(interaction.member.user.id, 'users', 'balance_bugs', (userdb.balance_bugs - summa))
			let fs = require('fs');
			fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Вы купили ${count} ${declOfNum(count, ['кейс', 'кейса', 'кейсов'])}.`,
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
		}else{
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `У вас недостаточно жучков.`
					}
				}
			});
		}
	}

	if(whattoDo == "витрина"){
			let itemID = interaction.data.options[0].options[0].value - 1;
			if(itemID < 0 || itemID > 1){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Укажите корректный номер предмета на витрине.`
						}
					}
				});
			}
			if(itemID == 0){
				if(userdb.shop_first == true){
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								flags: 64,
								content: `Вы уже покупали этот предмет, приходите позже!`
							}
						}
					});
				}
			}
			if(itemID == 1){
				if(userdb.shop_second == true){
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								flags: 64,
								content: `Вы уже покупали этот предмет, приходите позже!`
							}
						}
					});
				}
			}
			if(shop[itemID].type == "megacase"){
				let newID = shop[itemID].uid.toString();
				let memIndex = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == newID));
				if(userdb.gt >= shop[itemID].cost){
					if(itemID == 0){
						client.db.change(interaction.member.user.id, 'users', 'shop_first', 1)
					}
					if(itemID == 1){
						client.db.change(interaction.member.user.id, 'users', 'shop_second', 1)
					}
					inventory[interaction.member.user.id].cases[memIndex].megaCount += 1;
					fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
					client.db.change(interaction.member.user.id, 'users', 'balance_bugs', (userdb.balance_bugs - shop[itemID].cost))
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								embeds: [
									{
										color: 0xb88fff,
										title: 'Успешно',
										description: `Успешная покупка: ${shop[itemID].name}.`,
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
				}else{
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								flags: 64,
								content: `У вас недостаточно жучков.`
							}
						}
					});
				}
			}
			if(shop[itemID].type == "luckycase"){
				let newID = shop[itemID].uid;
				let memIndex = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == newID));
				if(userdb.balance_bugs >= shop[itemID].cost){
					if(itemID == 0){
						client.db.change(interaction.member.user.id, 'users', 'shop_first', 1)
					}
					if(itemID == 1){
						client.db.change(interaction.member.user.id, 'users', 'shop_second', 1)
					}
					inventory[interaction.member.user.id].cases[memIndex].luckyCount += 1;
					fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
					client.db.change(interaction.member.user.id, 'users', 'balance_bugs', (userdb.balance_bugs - shop[itemID].cost))
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								embeds: [
									{
										color: 0xb88fff,
										title: 'Успешно',
										description: `Успешная покупка: ${shop[itemID].name}.`,
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
				}else{
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								flags: 64,
								content: `У вас недостаточно жучков.`
							}
						}
					});
				}
			}
			if(shop[itemID].type == "item"){
				let newID = shop[itemID].uid;
				let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
				var checks;
				if(userdb.balance_fish >= shop[itemID].cost){
					if(itemID == 0){
						client.db.change(interaction.member.user.id, 'users', 'shop_first', 1)
					}
					if(itemID == 1){
						client.db.change(interaction.member.user.id, 'users', 'shop_second', 1)
					}
					client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_bugs - shop[itemID].cost))
					for(var i = 0; i<comlength; i++){
						if(inventory[interaction.member.user.id].items[i].itemname == cases[1].items[newID].name){
							inventory[interaction.member.user.id].items[i].county += 1;
							let fs = require("fs");
							fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
							checks = true;
							break;
						}
					checks = false;
					}
				if(cases[1].items[newID].class == 'Обычный'){
					resheart = "<:lz_ph:742051100068413540>";
					resclass = `${cases[1].items[newID].class}`;
				}
				if(cases[1].items[newID].class == 'Стандартный'){
					resheart = "<:lz_bh:773816589442875393>";
					resclass = `${cases[1].items[newID].class}`;
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
					fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
				}
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [
								{
									color: 0xb88fff,
									title: 'Успешно',
									description: `Успешная покупка: ${shop[itemID].name}.`,
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
				}else{
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								flags: 64,
								content: `У вас недостаточно жучков.`
							}
						}
					});
				}
			}
			if(shop[itemID].type == "money"){
				if(userdb.balance_fish >= shop[itemID].cost){
					if(itemID == 0){
						client.db.change(interaction.member.user.id, 'users', 'shop_first', 1)
					}
					if(itemID == 1){
						client.db.change(interaction.member.user.id, 'users', 'shop_second', 1)
					}
				client.db.change(interaction.member.user.id, 'users', 'balance_bugs', (userdb.balance_bugs + 1))
				client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_bugs - shop[itemID].cost))
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [
								{
									color: 0xb88fff,
									title: 'Успешно',
									description: `Успешная покупка: ${shop[itemID].name}.`,
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
				}else{
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								flags: 64,
								content: `У вас недостаточно жучков.`
							}
						}
					});
				}
			}
	}
	if(whattoDo == "магазин"){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Магазин',
								fields: [
									{
										name: "Награды",
										value: `Ежедневная — ${dailyStatus}\nЕженедельная — ${weeklyStatus}`,
										inline: false
									},
									{
										name: "Витрина",
										value: `1. ${shop[0].name} | ${shop[0].cost} ${shop[0].currency}
										2. ${shop[1].name} | ${shop[1].cost} ${shop[1].currency}`,
										inline: false
									},
									{
										name: "Кейсы",
										value: `1. <:lz_tree:774622409621897306> Кейс садовника\n2. <:lz_cmd:774302538626498580> Школьная библиотека`,
										inline: false
									}
								],
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
	
	
	
}catch(error){
		client.logger.log(`${error}`, "err");
		console.log(error);
	}
}

module.exports.help = {
	name: "магазин",
	aliases: ["vfufpby"],
	permissions: ["member"],
	modules: ["economy"]
}