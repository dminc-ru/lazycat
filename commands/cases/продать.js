let inventory = require(`${process.env.PATHTOBASE}/inventory.json`);
let cases = require(`${process.env.PATHTOBASE}/cases.json`);
module.exports.run = async (client, interaction) => {
try{
	let userdb = await client.db.get(interaction.member.user.id, 'users')
	var whattoDo = interaction.data.options[0].name;
	let user = client.users.cache.get(interaction.member.user.id);
	let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
	let fishsell = 0;
	var totalsum = 0;
	let bugsell = 0;
	if(comlength < 1){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Ваш инвентарь пуст.`
				}
			}
		});
	}
	if(whattoDo == "класс"){
		let classs = interaction.data.options[0].options[0].value;
		if(classs == 'Обычный'){
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
					totalsum+=1*inventory[interaction.member.user.id].items[i].county;
				}
			}
			if(totalsum == 0){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Предметов с такой редкостью не найдено.`
						}
					}
				});
			}
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + fishsell))
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								fields: [
									{
										name: "Продано предметов:",
										value: `${totalsum}`,
										inline: false
									},
									{
										name: "Заработано рыбок:",
										value: `${fishsell} <:lz_fish:742459590087803010>`,
										inline: true
									}
								],
								timestamp: new Date(),
								footer: {
									text: `${user.tag}`,
									icon_url: `${user.avatarURL()}`,
								}
							}
						]
					}
				}
			});
			let fs = require("fs");
			return fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
		}

		if(classs == 'Стандартный'){
			console.log('стандартный')
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
					totalsum+=1*inventory[interaction.member.user.id].items[i].county;
				}
			}
			if(totalsum == 0){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Предметов с такой редкостью не найдено.`
						}
					}
				});
			}
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + fishsell))
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								fields: [
									{
										name: "Продано предметов:",
										value: `${totalsum}`,
										inline: false
									},
									{
										name: "Заработано рыбок:",
										value: `${fishsell} <:lz_fish:742459590087803010>`,
										inline: true
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
			let fs = require("fs");
			return fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
		}

		if(classs == 'Особый'){
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
					totalsum+=1*inventory[interaction.member.user.id].items[i].county;
				}
			}
			if(totalsum == 0){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Предметов с такой редкостью не найдено.`
						}
					}
				});
			}
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + fishsell))
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								fields: [
									{
										name: "Продано предметов:",
										value: `${totalsum}`,
										inline: false
									},
									{
										name: "Заработано рыбок:",
										value: `${fishsell} <:lz_fish:742459590087803010>`,
										inline: true
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
			let fs = require("fs");
			return fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
		}

		if(classs == 'Редкий'){
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
					totalsum+=1*inventory[interaction.member.user.id].items[i].county;
				}
			}
			if(totalsum == 0){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Предметов с такой редкостью не найдено.`
						}
					}
				});
			}
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + fishsell))
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								fields: [
									{
										name: "Продано предметов:",
										value: `${totalsum}`,
										inline: false
									},
									{
										name: "Заработано рыбок:",
										value: `${fishsell} <:lz_fish:742459590087803010>`,
										inline: true
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
			let fs = require("fs");
			return fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
		}

		if(classs == 'Тайный'){
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
					totalsum+=1*inventory[interaction.member.user.id].items[i].county;
				}
			}
			if(totalsum == 0){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Предметов с такой редкостью не найдено.`
						}
					}
				});
			}
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + fishsell))
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								fields: [
									{
										name: "Продано предметов:",
										value: `${totalsum}`,
										inline: false
									},
									{
										name: "Заработано рыбок:",
										value: `${fishsell} <:lz_fish:742459590087803010>`,
										inline: true
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
			let fs = require("fs");
			return fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
		}

		if(classs == 'Легендарный'){
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
					totalsum+=1*inventory[interaction.member.user.id].items[i].county;
				}
			}
			if(totalsum == 0){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Предметов с такой редкостью не найдено.`
						}
					}
				});
			}
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + fishsell))
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								fields: [
									{
										name: "Продано предметов:",
										value: `${totalsum}`,
										inline: false
									},
									{
										name: "Заработано рыбок:",
										value: `${fishsell} <:lz_fish:742459590087803010>`,
										inline: true
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
			let fs = require("fs");
			return fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
		}
	}
	if(whattoDo == 'всё'){
		for(var i = 0; i<comlength; i++){
			if(inventory[interaction.member.user.id].items[i].currency == '<:lz_fish:742459590087803010>')
				fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
			if(inventory[interaction.member.user.id].items[i].currency == '<:lz_bug:742039591929905223>')
				bugsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
			totalsum+=1*inventory[interaction.member.user.id].items[i].county;
		}
		let tosell = comlength + 1;
		inventory[interaction.member.user.id].items.splice(0, tosell);
		client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + fishsell))
		client.db.change(interaction.member.user.id, 'users', 'balance_bugs', (userdb.balance_bugs + bugsell))
		let factfish = bugsell * 100;
		factfish += fishsell;
		let factzar = factfish - userdb.case_open;
		client.db.change(interaction.member.user.id, 'users', 'case_open', 0)
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Успешно',
							fields: [
								{
									name: "Продано предметов:",
									value: `${totalsum}`,
									inline: false
								},
								{
									name: "Заработано рыбок:",
									value: `${fishsell} <:lz_fish:742459590087803010>`,
									inline: true
								},
								{
									name: "Заработано жучков:",
									value: `${bugsell} <:lz_bug:742039591929905223>`,
									inline: true
								},
								{
									name: "Фактический заработок:",
									value: `${factzar} <:lz_fish:742459590087803010>`,
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
		let fs = require("fs");
		return fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
	}
	if(whattoDo == 'номер'){
		let uid = interaction.data.options[0].options[0].value;
		uid -= 1;
		if(uid < 0){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Укажите корректный номер предмета.`
					}
				}
			});
		}
		if(!inventory[interaction.member.user.id].items[uid])
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Предмет с этим номером не найден.`
					}
				}
			});
		if(inventory[interaction.member.user.id].items[uid].currency == '<:lz_fish:742459590087803010>'){
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + inventory[interaction.member.user.id].items[uid].cost))
			if(inventory[interaction.member.user.id].items[uid].county > 1){
				inventory[interaction.member.user.id].items[uid].county -= 1;
				let caseIDcase = inventory[interaction.member.user.id].items[uid].IDcase;
				client.db.change(interaction.member.user.id, 'users', 'case_open', (userdb.case_open - cases[caseIDcase].cost * 120))
			}else{
				let caseIDcase = inventory[interaction.member.user.id].items[uid].IDcase;
				inventory[interaction.member.user.id].items.splice(uid, 1);
				client.db.change(interaction.member.user.id, 'users', 'case_open', (userdb.case_open - cases[caseIDcase].cost * 120))
			}
		}else{
		if(inventory[interaction.member.user.id].items[uid].currency == '<:lz_bug:742039591929905223>'){
			client.db.change(interaction.member.user.id, 'users', 'balance_bugs', (userdb.balance_bugs + inventory[interaction.member.user.id].items[uid].cost))
			if(inventory[interaction.member.user.id].items[uid].county > 1){
				inventory[interaction.member.user.id].items[uid].county -= 1;
			}else{
				inventory[interaction.member.user.id].items.splice(uid, 1);
			}
		};
		}
		let fs = require("fs");
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Продано!',
							description: `Вы продали ${inventory[interaction.member.user.id].items[uid].itemname} за ${inventory[interaction.member.user.id].items[uid].cost} ${inventory[interaction.member.user.id].items[uid].currency}`,
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
		return fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
	}	
}catch(error){
			client.logger.log(`${error}`, "err")
		}
}

module.exports.help = {
	name: "продать",
	aliases: ["ghjlfnm"],
	permissions: ["member"],
	modules: ["cases"]
}