let inventory = require(`${client.config.jsonPath}inventory.json`);
let cases = require(`${client.config.jsonPath}cases.json`);
module.exports.run = async (client, interaction) => {
	let userdb = await client.db.get(interaction.member.user.id, 'users')
	var whattoDo = interaction.data.options[0].name;
	let user = client.users.cache.get(interaction.member.user.id);
	let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
	let fishsell = 0;
	var totalsum = 0;
	let bugsell = 0;
	if(comlength < 1)
		return interaction.reply({content: `Ваш инвентарь пуст.`, ephemeral: true})
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
			if(totalsum == 0)
				return interaction.reply({content: `Предметов с такой редкостью не найдено.`, ephemeral: true})
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			await client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + fishsell))
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Успешно`)
				.addField(`Продано предметов:`, totalsum, false)
				.addField(`Заработано рыбок:`, `${fishsell} ${client.emoji.fish}`, true)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			await interaction.reply({embeds: [successEmbed]})
			let fs = require("fs");
			return fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
		}

		if(classs == 'Стандартный'){
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
					totalsum+=1*inventory[interaction.member.user.id].items[i].county;
				}
			}
			if(totalsum == 0)
				return interaction.reply({content: `Предметов с такой редкостью не найдено.`, ephemeral: true})
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			await client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + fishsell))
			let successEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Успешно`)
				.addField(`Продано предметов:`, totalsum, false)
				.addField(`Заработано рыбок:`, `${fishsell} ${client.emoji.fish}`, true)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			await interaction.reply({embeds: [successEmbed]})
			let fs = require("fs");
			return fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
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
				return interaction.reply({content: `Предметов с такой редкостью не найдено.`, ephemeral: true})
			}
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			await client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + fishsell))
			let successEmbed = new MessageEmbed()
				.setColor('Успешно')
				.addField(`Продано предметов:`, totalsum, false)
				.addField(`Заработано рыбок:`, `${fishsell} ${client.emoji.fish}`, true)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			interaction.reply({embeds: [successEmbed]})
			let fs = require("fs");
			return fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
		}

		if(classs == 'Редкий'){
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
					totalsum+=1*inventory[interaction.member.user.id].items[i].county;
				}
			}
			if(totalsum == 0)
				return interaction.reply({content: `Предметов с такой редкостью не найдено.`, ephemeral: true})
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + fishsell))
			let successEmbed = new MessageEmbed()
				.setColor('Успешно')
				.addField(`Продано предметов:`, totalsum, false)
				.addField(`Заработано рыбок:`, `${fishsell} ${client.emoji.fish}`, true)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			interaction.reply({embeds: [successEmbed]})
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
			if(totalsum == 0)
				return interaction.reply({content: `Предметов с такой редкостью не найдено.`, ephemeral: true})
			
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + fishsell))
			let successEmbed = new MessageEmbed()
				.setColor('Успешно')
				.addField(`Продано предметов:`, totalsum, false)
				.addField(`Заработано рыбок:`, `${fishsell} ${client.emoji.fish}`, true)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			interaction.reply({embeds: [successEmbed]})
			let fs = require("fs");
			return fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
		}

		if(classs == 'Легендарный'){
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
					totalsum+=1*inventory[interaction.member.user.id].items[i].county;
				}
			}
			if(totalsum == 0)
				return interaction.reply({content: `Предметов с такой редкостью не найдено.`, ephemeral: true})
			
			for(var i = 0; i<comlength; i++){
				if(!inventory[interaction.member.user.id].items[i]) break;
				if(inventory[interaction.member.user.id].items[i].itemclass == interaction.data.options[0].options[0].value){
					inventory[interaction.member.user.id].items.splice(i, 1);
				}
			}
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + fishsell))
			let successEmbed = new MessageEmbed()
				.setColor('Успешно')
				.addField(`Продано предметов:`, totalsum, false)
				.addField(`Заработано рыбок:`, `${fishsell} ${client.emoji.fish}`, true)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			interaction.reply({embeds: [successEmbed]})
			let fs = require("fs");
			return fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
		}
	}
	if(whattoDo == 'всё'){
		for(var i = 0; i<comlength; i++){
			if(inventory[interaction.member.user.id].items[i].currency == client.emoji.fish)
				fishsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
			if(inventory[interaction.member.user.id].items[i].currency == client.emoji.bug)
				bugsell += inventory[interaction.member.user.id].items[i].cost * inventory[interaction.member.user.id].items[i].county;
			totalsum+=1*inventory[interaction.member.user.id].items[i].county;
		}
		let tosell = comlength + 1;
		inventory[interaction.member.user.id].items.splice(0, tosell);
		client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + fishsell))
		client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs + bugsell))
		let factfish = bugsell * 100;
		factfish += fishsell;
		let factzar = factfish - userdb.case_open;
		client.db.changeUser(interaction.member.user.id, 'case_open', 0)
		let successEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Успешно')
			.addField(`Продано предметов:`, totalsum, false)
			.addField(`Заработано рыбок:`, `${fishsell} ${client.emoji.fish}`, true)
			.addField(`Заработано жучков:`, `${bugsell} ${client.emoji.bug}`, true)
			.addField(`Фактический заработок:`, `${factzar} ${client.emoji.fish}`, false)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		await interaction.reply({embeds: [successEmbed]})
		let fs = require("fs");
		return fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
	}
	if(whattoDo == 'номер'){
		let uid = interaction.data.options[0].options[0].value;
		uid -= 1;
		if(uid < 0)
			return interaction.reply({content: `Укажите корректный номер предмета.`, ephemeral: true})
		if(!inventory[interaction.member.user.id].items[uid])
			return interaction.reply({content: `Предмет с этим номером не найден.`, ephemeral: true})
		if(inventory[interaction.member.user.id].items[uid].currency == client.emoji.fish){
			client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + inventory[interaction.member.user.id].items[uid].cost))
			if(inventory[interaction.member.user.id].items[uid].county > 1){
				inventory[interaction.member.user.id].items[uid].county -= 1;
				let caseIDcase = inventory[interaction.member.user.id].items[uid].IDcase;
				client.db.changeUser(interaction.member.user.id, 'case_open', (userdb.case_open - cases[caseIDcase].cost * 120))
			}else{
				let caseIDcase = inventory[interaction.member.user.id].items[uid].IDcase;
				inventory[interaction.member.user.id].items.splice(uid, 1);
				client.db.changeUser(interaction.member.user.id, 'case_open', (userdb.case_open - cases[caseIDcase].cost * 120))
			}
		}else{
		if(inventory[interaction.member.user.id].items[uid].currency == client.emoji.bug){
			client.db.changeUser(interaction.member.user.id, 'balance_bugs', (userdb.balance_bugs + inventory[interaction.member.user.id].items[uid].cost))
			if(inventory[interaction.member.user.id].items[uid].county > 1){
				inventory[interaction.member.user.id].items[uid].county -= 1;
			}else{
				inventory[interaction.member.user.id].items.splice(uid, 1);
			}
		};
		}
		let fs = require("fs");
		let selledEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Продано!')
			.setDescription(`Вы продали ${inventory[interaction.member.user.id].items[uid].itemname} за ${inventory[interaction.member.user.id].items[uid].cost} ${inventory[interaction.member.user.id].items[uid].currency}`)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}));
		await interaction.reply({embeds: [selledEmbed]})
		return fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
	}
}

module.exports.data = {
	name: "продать",
	permissions: ["member"],
	type: "interaction"
}