const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		let cases = require(`${client.config.jsonPath}cases.json`);
		let inventory = require(`${client.config.jsonPath}inventory.json`);
		let noUser = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Ошибка')
			.setDescription('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return interaction.reply({embeds: [noUser]})
		}
		var IDcase;
		if(interaction.data.options) 
			IDcase = interaction.options.getInteger('номер');
		let memIndex1 = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == "1"));
		let memIndex2 = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == "2"));
		let numberOfCase1 = inventory[interaction.member.user.id].cases[memIndex1].count;
		let numberOfCase2 = inventory[interaction.member.user.id].cases[memIndex2].count;
		if(!IDcase) {
			let availableCases = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Кейсы`)
				.setDescription(`Доступные кейсы:
					1. ${client.emoji.tree} Кейс садовника • ${cases[1].cost} ${cases[1].currency} • У вас: ${numberOfCase1} шт.
					2. ${client.emoji.cmd} Школьная библиотека • ${cases[2].cost} ${cases[2].currency} • У вас: ${numberOfCase2} шт.`)
				.addField(`Редкости:`, `${client.emoji.ph} Обычный ${client.emoji.ph}
					${client.emoji.bh} Стандартный ${client.emoji.bh}
					${client.emoji.gh} __Особый__ ${client.emoji.gh}
					${client.emoji.yh} *Редкий* ${client.emoji.yh}
					${client.emoji.oh} **Тайный** ${client.emoji.oh}
					${client.emoji.rh} ***Легендарный*** ${client.emoji.rh}`, true)
				.addField(`Команды`, `Открыть: /кейс <номер_кейса>
				Купить кейсы: /магазин кейс <номер_кейса> <кол-во>`, true)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [availableCases]})
		}
		if( (IDcase < 1) || (!cases[IDcase]) )
			return interaction.reply({content: "Введите корректный номер кейса.", ephemeral: true})
		let memIndex = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == IDcase));
		let balances = Number(inventory[interaction.member.user.id].cases[memIndex].count);
		if(balances > 0){
			inventory[interaction.member.user.id].cases[memIndex].count -= 1;
			let fs = require('fs');
			fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
		}else{
			return interaction.reply({content: "У вас нет этого кейса."})
		}

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
		if(chuck >= 2 && chuck <= 4){
			var result = random(20, 24);
		}
		if(chuck >= 5 && chuck <= 12){
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
		if(!inventory[interaction.member.user.id]){
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
		}
		let resheart = "";
		let resclass = "";
		if(cases[IDcase].items[result].class == 'Обычный'){
			resheart = client.emoji.ph;
			resclass = `${cases[IDcase].items[result].class}`;
		}
		if(cases[IDcase].items[result].class == 'Стандартный'){
			resheart = client.emoji.bh;
			resclass = `${cases[IDcase].items[result].class}`;
		}
		if(cases[IDcase].items[result].class == 'Особый'){
			resheart = client.emoji.gh;
			resclass = `__${cases[IDcase].items[result].class}__`;
		}
		if(cases[IDcase].items[result].class == 'Редкий'){
			resheart = client.emoji.yh;
			resclass = `*${cases[IDcase].items[result].class}*`;
		}
		if(cases[IDcase].items[result].class == 'Тайный'){
			resheart = client.emoji.oh;
			resclass = `**${cases[IDcase].items[result].class}**`;
		}
		if(cases[IDcase].items[result].class == 'Легендарный'){
			resheart = client.emoji.rh;
			resclass = `***${cases[IDcase].items[result].class}***`;
		}
		if(cases[IDcase].items[result].class == 'ОфИгЕнНоЕ'){
					resheart = `${client.emoji.wh}${client.emoji.wh}${client.emoji.wh}${client.emoji.wh}${client.emoji.wh}`;
					resclass = `__***~~ОфИгЕнНоЕ~~***__`;
		}
		let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
		var checks;
		for(var i = 0; i<comlength; i++){
			if(inventory[interaction.member.user.id].items[i].itemname == cases[IDcase].items[result].name){
				inventory[interaction.member.user.id].items[i].county += 1;
				let fs = require("fs");
				fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
				checks = true;
				break;
			}
			checks = false;
		}
		if(!checks){
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
		let fs = require("fs");
		fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
		let newItem = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`Кейсы`)
			.setDescription(`Поздравляем! Вам выпал предмет: ${cases[IDcase].items[result].name}`)
			.addField(`Описание`, cases[IDcase].items[result].description, false)
			.addField(`Класс`, `${resheart} ${resclass} ${resheart}`, true)
			.addField(`Стоимость`, `${cases[IDcase].items[result].cost} ${cases[IDcase].items[result].currency}`, true)
			.addField(`Кейс`, cases[IDcase].name)
			.setThumbnail(cases[IDcase].items[result].image)
			.setTimestamp()
			.setFooter(`${user.tag} • /инвентарь`, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [newItem]})
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
	}
}
module.exports.data = {
	name: "кейс",
	permissions: ["member"],
	type: "interaction"
}