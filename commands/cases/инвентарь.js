const fs = require("fs");
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try{
		let inventory = require(`${client.config.jsonPath}inventory.json`);
		let user = await client.users.fetch(interaction.member.user.id);
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
			fs.writeFileSync(`${client.config.jsonPath}inventory.json`, JSON.stringify(inventory, null, "\t"));
		}
		let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
		if(comlength == 0){
			let inventorys = "Пусто. Откройте кейс!";
			let inventoryEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Инвентарь ${user.tag}`)
				.setDescription(inventorys)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [inventoryEmbed]});
		}
		let number = 1;
		pages = Math.ceil(comlength/15);
		if(!interaction.data.options){
			let inventoryss = "";
			for(i=0; i<15; i++){
			if(inventory[interaction.member.user.id].items[i]){
				inventoryss += `${number}. ${inventory[interaction.member.user.id].items[i].itemname} • ${inventory[interaction.member.user.id].items[i].cost} ${inventory[interaction.member.user.id].items[i].currency} • ${inventory[interaction.member.user.id].items[i].county} шт. • ${inventory[interaction.member.user.id].items[i].heart}\n`;
				number+=1;
			}
			if(inventoryss == "")
				inventorys = "Пусто. Откройте кейс!";
			}
		
			if(inventoryss == "")
				inventorys = "Пусто. Откройте кейс!";
				let inventoryEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Инвентарь ${user.tag}`)
					.setDescription(inventoryss)
					.setTimestamp()
					.setFooter(`${user.tag} • Страница 1/${pages}`, user.displayAvatarURL({dynamic: true}))
				return interaction.reply({embeds: [inventoryEmbed]})
		}
		let page = interaction.data.options[0].value;
		if ( (!Number(page)) || (page <= 0) || (page > pages) ){
			return interaction.reply({content: `Некорректная страница.`, ephemeral: true})
		}
		let inventoryss = "";
		if(page){
			if(page > 1){
				var prpage = page - 1;
				var i = 15*prpage;
				number = i + 1;
				var ogr = page * 15;
				for(i; i<ogr; i++){
					if(inventory[interaction.member.user.id].items[i]){
						inventoryss += `${number}. ${inventory[interaction.member.user.id].items[i].itemname} • ${inventory[interaction.member.user.id].items[i].cost} ${inventory[interaction.member.user.id].items[i].currency} • ${inventory[interaction.member.user.id].items[i].county} шт. • ${inventory[interaction.member.user.id].items[i].heart}\n`;
						number+=1;
					}
				}
				let inventoryEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Инвентарь ${user.tag}`)
					.setDescription(inventoryss)
					.setTimestamp()
					.setFooter(`${user.tag} • Страница ${page}/${pages}`, user.displayAvatarURL({dynamic: true}))
				return interaction.reply({embeds: [inventoryEmbed]})
				}
				i = 0;
				number = 1;
				var ogr = page * 15;
			}
			if(page == 1){
				for(i; i<15; i++){
					if(inventory[interaction.member.user.id].items[i]){
						inventoryss += `${number}. ${inventory[interaction.member.user.id].items[i].itemname} • ${inventory[interaction.member.user.id].items[i].cost} ${inventory[interaction.member.user.id].items[i].currency} • ${inventory[interaction.member.user.id].items[i].county} шт. • ${inventory[interaction.member.user.id].items[i].heart}\n`;
						number+=1;
					}
				}
				let inventoryEmbed = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Инвентарь ${user.tag}`)
					.setDescription(inventoryss)
					.setTimestamp()
					.setFooter(`${user.tag} • Страница ${page}/${pages}`, user.displayAvatarURL({dynamic: true}))
				return interaction.reply({embeds: [inventoryEmbed]})
			}
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
	}
}

module.exports.data = {
	name: "инвентарь",
	permissions: ["member"],
	type: "interaction"
}