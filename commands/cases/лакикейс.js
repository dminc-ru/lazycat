module.exports.run = async (client, interaction) => {
	let cases = require(`${client.config.jsonPath}cases.json`);
	let inventory = require(`${client.config.jsonPath}inventory.json`);
	let user = await client.users.fetch(interaction.member.user.id);
	var IDcase;
	if(interaction.data.options) 
		IDcase = interaction.data.options[0].value;
	let memIndex1 = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == "1"));
	let memIndex2 = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == "2"));
	let numberOfCase1 = inventory[interaction.member.user.id].cases[memIndex1].luckyCount;
	let numberOfCase2 = inventory[interaction.member.user.id].cases[memIndex2].luckyCount;
	if(!IDcase) {
		let caseInfo = new MessageEmbed()
			.setTitle(`Лакикейсы`)
			.setDescription(`Доступные лакикейсы:
				1. ${client.emoji.tree} Кейс садовника • У вас ${numberOfCase1} шт.
				2. ${client.emoji.cmd} Школьная библиотека • У вас: ${numberOfCase2} шт.`)
			.addField(`Редкости:`, `${client.emoji.ph} Обычный ${client.emoji.ph}
				${client.emoji.bh} Стандартный ${client.emoji.bh}
				${client.emoji.gh} __Особый__ ${client.emoji.gh}
				${client.emoji.yh} *Редкий* ${client.emoji.yh}
				${client.emoji.oh} **Тайный** ${client.emoji.oh}
				${client.emoji.rh} ***Легендарный*** ${client.emoji.rh}`, true)
			.addField(`Команды:`, `Открыть: /лакикейс <номер_кейса>
				Инвентарь: /инвентарь`, true)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [caseInfo]})
	}
	if( (IDcase < 1) || (!cases[IDcase]) )
		return interaction.reply({content: "Введите корректный номер кейса.", ephemeral: true})
	let memIndex = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == IDcase));
	let balances = Number(inventory[interaction.member.user.id].cases[memIndex].luckyCount);
	if(balances > 0){
		inventory[interaction.member.user.id].cases[memIndex].luckyCount = balances - 1;
		let fs = require('fs');
		fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
	}else{
		return interaction.reply({content: "У вас недостаточно средств.", ephemeral: true})
	}
	function random(min, max) {
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}
	let chuck = random(1, 100);
	if(chuck == 1){
		var chuck1 = random(1, 100);
		if(chuck1 >= 1 && chuck1 <= 3){
			var result = 30;
		}
	}
	if(chuck >= 2 && chuck <= 4){
		var result = random(25, 29)
	}
	if(chuck >= 5 && chuck <= 17){
		var result = random(20, 24);
	}
	if(chuck >= 18 && chuck <= 32){
		var result = random(15, 19);
	}
	if(chuck >= 33 && chuck <= 48){
		var result = random(10, 14);
	}
	if(chuck >= 49 && chuck <= 74){
		var result = random(5, 9);
	}
	if(chuck >= 75 && chuck <= 100){
		var result = random(0, 4);
	}
	if(!inventory[interaction.member.user.id]){
		inventory[interaction.member.user.id] = {
			casess: [
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
		.setTitle(`Лакикейсы`)
		.setDescription(`Поздравляем! Вам выпал предмет: ${cases[IDcase].items[result].name}`)
		.addField(`Описание`, cases[IDcase].items[result].description, false)
		.addField(`Класс`, `${resheart} ${resclass} ${resheart}`, true)
		.addField(`Стоимость`, `${cases[IDcase].items[result].cost} ${cases[IDcase].items[result].currency}`, true)
		.addField(`Кейс`, cases[IDcase].name)
		.setThumbnail(cases[IDcase].items[result].image)
		.setTimestamp()
		.setFooter(`${user.tag} • /инвентарь`, user.displayAvatarURL({dynamic: true}))
	return interaction.reply({embeds: [newItem]})
}
module.exports.data = {
	name: "лакикейс",
	permissions: ["member"],
	type: "interaction"
}