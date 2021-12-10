const { MessageEmbed } = require("discord.js"); 
let cases = require(`${process.env.PATHTOBASE}/cases.json`);
let inventory = require(`${process.env.PATHTOBASE}/inventory.json`);
module.exports.run = async (client, interaction) => {
try{
	let user = client.users.cache.get(interaction.member.user.id);
	var IDcase;
	if(interaction.data.options) 
		IDcase = interaction.data.options[0].value;
	let memIndex1 = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == "1"));
	let memIndex2 = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == "2"));
	let numberOfCase1 = inventory[interaction.member.user.id].cases[memIndex1].megaCount;
	let numberOfCase2 = inventory[interaction.member.user.id].cases[memIndex2].megaCount;
	if(!IDcase)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: `Мегакейсы`,
						description: `Доступные кейсы:\n1. <:lz_tree:774622409621897306> Кейс садовника • У вас: ${numberOfCase1} шт.\n2. <:lz_cmd:774302538626498580> Школьная библиотека • У вас: ${numberOfCase2} шт.`,
						fields: [
							{
								name: 'Редкости:',
								value: `<:lz_ph:742051100068413540> Обычный <:lz_ph:742051100068413540>\n<:lz_bh:773816589442875393> Стандартный <:lz_bh:773816589442875393>\n<:lz_gh:773816562284888115> __Особый__ <:lz_gh:773816562284888115>\n<:lz_yh:773816540616589372> *Редкий*  <:lz_yh:773816540616589372>\n<:lz_oh:773815092130480138> **Тайный** <:lz_oh:773815092130480138>\n<:lz_rh:773814278864109589> ***Легендарный***  <:lz_rh:773814278864109589>`,
								inline: true
							},
							{
								name: 'Команды:',
								value: `Открыть: /мегакейс <номер_кейса>\nИнвентарь: /инвентарь`,
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
	if(IDcase < 1)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `Введите корректный номер кейса.`
			}
		}
	}); 
		let num = 1;
		if(!cases[IDcase])
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Введите корректный номер кейса.`
				}
			}
		}); 
		let memIndex = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == IDcase));
	let balances = Number(inventory[interaction.member.user.id].cases[memIndex].megaCount);
	if(balances > 0){
		inventory[interaction.member.user.id].cases[memIndex].megaCount = balances - 1;
		let fs = require('fs');
		fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
	}else{
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `У вас нет мегакейсов.`
				}
			}
		}); 
	}
		var ogr = 10;
		var delay = 3000;
		var channel = client.channels.cache.get(interaction.channel_id)
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Успешно: мегакейс открывается.`
				}
			}
		}); 
		for(var a = 0; a<ogr; a++){
			function random(min, max) {
				let rand = min - 0.5 + Math.random() * (max - min + 1);
				return Math.round(rand);
			}
			let chuck = random(1, 100);
			if(chuck == 1){
				var chuck1 = random(1, 100);
				if(chuck1 == 2){
					var result = 30;
				}else{
					var chuck2 = random(1, 100);
					if(chuck2 == 5)
						var result = random(25, 29)
					else{var result = random(0, 4)}
				}
			}
			if(chuck == 2){
				var result = random(20, 24);
			}
			if(chuck >= 3 && chuck <= 12){
				var result = random(15, 19);
			}
			if(chuck >= 13 && chuck <= 25){
				var result = random(10, 14);
			}
			if(chuck >= 26 && chuck <= 49){
				var result = random(5, 9);
			}
			if(chuck >= 50 && chuck <= 100){
				var result = random(0, 4);
			}
			if(!inventory[interaction.member.user.id])
				inventory[interaction.member.user.id] = {
					cases: [
						{
							caseID: "1",
							count: 0,
							megaCount: 0,
							luckyCount: 0
						},
						{
							caseID: "2",
							count: 0,
							megaCount: 0,
							luckyCount: 0
						}
					],
					items: []
				};
			let resheart = "";
			let resclass = "";
			if(cases[IDcase].items[result].class == 'Обычный'){
				resheart = "<:lz_ph:742051100068413540>";
				resclass = `${cases[IDcase].items[result].class}`;
			}
			if(cases[IDcase].items[result].class == 'Стандартный'){
				resheart = "<:lz_bh:773816589442875393>";
				resclass = `${cases[IDcase].items[result].class}`;
			}
			if(cases[IDcase].items[result].class == 'Особый'){
				resheart = "<:lz_gh:773816562284888115>";
				resclass = `__${cases[IDcase].items[result].class}__`;
			}
			if(cases[IDcase].items[result].class == 'Редкий'){
				resheart = "<:lz_yh:773816540616589372>";
				resclass = `*${cases[IDcase].items[result].class}* `;
			}
			if(cases[IDcase].items[result].class == 'Тайный'){
				resheart = "<:lz_oh:773815092130480138>";
				resclass = `**${cases[IDcase].items[result].class}**`;
			}
			if(cases[IDcase].items[result].class == 'Легендарный'){
				resheart = "<:lz_rh:773814278864109589>";
				resclass = `***${cases[IDcase].items[result].class}*** `;
			}
			if(cases[IDcase].items[result].class == 'ОфИгЕнНоЕ'){
				resheart = "<:lz_wh:773996117863825438><:lz_wh:773996117863825438><:lz_wh:773996117863825438><:lz_wh:773996117863825438><:lz_wh:773996117863825438>";
				resclass = `__***~~ОфИгЕнНоЕ~~***__ `;
			}
			let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
			let checks = false;
			if(comlength > 0){
				for(var i = 0; i<comlength; i++){
					if(inventory[interaction.member.user.id].items[i].itemname == cases[IDcase].items[result].name){
						inventory[interaction.member.user.id].items[i].county += 1;
						checks = true;
						break;
					}
				}
			}
			if(checks == false){
			inventory[interaction.member.user.id].items.push({
				itemname: cases[IDcase].items[result].name,
				description: cases[IDcase].items[result].description,
				itemclass: cases[IDcase].items[result].class,
				textItemclass: resclass,
				heart: resheart,
				cost: cases[IDcase].items[result].cost,
				currency: cases[IDcase].items[result].currency,
				type: cases[IDcase].items[result].type,
				purchase: cases[IDcase].items[result].purchase,
				county: 1,
				IDcase: IDcase
			});
			}
			let embedResult = new MessageEmbed()
				.setColor(`#b88fff`)
				.setTitle(`Мегакейсы: предмет #${num}`)
				.setDescription(`Поздравляем! Вам выпал предмет: ${cases[IDcase].items[result].name}`)
				.addField(`Описание`,`${cases[IDcase].items[result].description}`, false)
				.addField(`Класс`, `${resheart} ${resclass} ${resheart}`, true)
				.addField(`Стоимость`, `${cases[IDcase].items[result].cost} ${cases[IDcase].items[result].currency}`, true)
				.addField(`Кейс`, `${cases[IDcase].name}`)
				.setThumbnail(`${cases[IDcase].items[result].image}`)
				.setTimestamp()
				.setFooter(`${user.tag} • /инвентарь`, user.displayAvatarURL());
				
				setTimeout(() => {
					channel.send(embedResult);
				}, delay);
				delay += 3000;
				num+=1;
		}
		let fs = require("fs");
		fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
}catch(error){
			client.logger.log(`${error}`, "err");
		}
}
module.exports.help = {
	name: "мегакейс",
	aliases: ["mtufrtqc"],
	permissions: ["member"],
	modules: ["cases"]
}