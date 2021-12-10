const fs = require("fs");
let inventory = require(`${process.env.PATHTOBASE}/inventory.json`);
module.exports.run = async (client, interaction) => {
	try{
		let user = client.users.cache.get(interaction.member.user.id);
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
		fs.writeFileSync(`${process.env.PATHTOBASE}/inventory.json`, JSON.stringify(inventory, null, "\t"));
	}
	let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
	if(comlength == 0){
		let inventorys = "Пусто. Откройте кейс!";
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: `Инвентарь ${user.tag}`,
							description: `${inventorys}`,
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
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: `Инвентарь ${user.tag}`,
								description: `${inventoryss}`,
								timestamp: new Date(),
								footer: {
									text: `${user.tag} • Страница 1/${pages}`,
									icon_url: `${user.displayAvatarURL()}`,
								}
							}
						]
					}
				}
			});
	}
	let page = interaction.data.options[0].value;
	if(page <= 0){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Некорректная страница.`
				}
			}
		}); 
	}
	//if(comlength > 15){
		if(!Number(page)){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Некорректная страница.`
					}
				}
			}); 
		}
		if(page <= 0){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Некорректная страница.`
					}
				}
			}); 
		}
		if(page > pages){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Некорректная страница.`
					}
				}
			}); 
		}
		let inventoryss = "";
		if(page){
			if(page > 1){
				var prpage = page - 1;
				var i = 15*prpage;
				number = i;
				number += 1;
				var ogr = page;
				ogr = ogr*15;
				for(i; i<ogr; i++){
					if(inventory[interaction.member.user.id].items[i]){
						inventoryss += `${number}. ${inventory[interaction.member.user.id].items[i].itemname} • ${inventory[interaction.member.user.id].items[i].cost} ${inventory[interaction.member.user.id].items[i].currency} • ${inventory[interaction.member.user.id].items[i].county} шт. • ${inventory[interaction.member.user.id].items[i].heart}\n`;
						number+=1;
					}
				}
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [
								{
									color: 0xb88fff,
									title: `Инвентарь ${user.tag}`,
									description: `${inventoryss}`,
									timestamp: new Date(),
									footer: {
										text: `${user.tag} • Страница ${page}/${pages}`,
										icon_url: `${user.displayAvatarURL()}`,
									}
								}
							]
						}
					}
				});
			}
			i = 0;
			number = 1;
			var ogr = page;
			ogr = ogr*15;
		}
		if(page == 1){
		for(i; i<15; i++){
			if(inventory[interaction.member.user.id].items[i]){
				inventoryss += `${number}. ${inventory[interaction.member.user.id].items[i].itemname} • ${inventory[interaction.member.user.id].items[i].cost} ${inventory[interaction.member.user.id].items[i].currency} • ${inventory[interaction.member.user.id].items[i].county} шт. • ${inventory[interaction.member.user.id].items[i].heart}\n`;
				number+=1;
			}
		}
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: `Инвентарь ${user.tag}`,
							description: `${inventoryss}`,
							timestamp: new Date(),
							footer: {
								text: `${user.tag} • Страница ${page}/${pages}`,
								icon_url: `${user.displayAvatarURL()}`,
							}
						}
					]
				}
			}
		});
		}
	//}
	
	}catch(error){
			client.logger.log(`${error}`, "err");
		}
}

module.exports.help = {
	name: "инвентарь",
	aliases: ["bydtynfhm"],
	permissions: ["member"],
	modules: ["cases"]
}