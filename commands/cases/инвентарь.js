const Command = require('../../class/Command')
class Inventory extends Command {
	constructor(client) {
		super(client, {
			name: 'инвентарь',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: false
		})
	}

	async run (client, interaction) {
		try{
			let inventory = client.json.inventory
			let noUser = client.utils.error('Пользователь не найден в базе данных.')
			try {
				var user = await client.users.fetch(interaction.member.user.id);
			} catch (error) {
				return interaction.reply({embeds: [noUser], ephemeral: true})
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
				await client.saveJSON('inventory', inventory)
			}
			let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
			if(comlength == 0){
				let inventorys = "Пусто. Откройте кейс!";
				let inventoryEmbed = client.utils.embed(`Инвентарь ${user.tag}`, inventorys, user)
				return interaction.reply({embeds: [inventoryEmbed]});
			}
			let number = 1;
			let pages = Math.ceil(comlength/15);
			if(!interaction.options.getInteger('страница')){
				let inventoryss = "";
				for(i=0; i<15; i++){
				if(inventory[interaction.member.user.id].items[i]){
					inventoryss += `${number}. ${inventory[interaction.member.user.id].items[i].itemname} • ${inventory[interaction.member.user.id].items[i].cost} ${inventory[interaction.member.user.id].items[i].currency} • ${inventory[interaction.member.user.id].items[i].county} шт. • ${inventory[interaction.member.user.id].items[i].heart}\n`;
					number+=1;
				}
				if(inventoryss == "") {
					inventoryss = "Пусто. Откройте кейс!";
					break
				}
				}
			
				if(inventoryss == "")
					inventoryss = "Пусто. Откройте кейс!";
					let inventoryEmbed = client.utils.embed(`Инвентарь ${user.tag}`, inventoryss)
						.setFooter({ text: `${user.tag} • Страница 1/${pages}`, iconURL: user.displayAvatarURL({dynamic: true}) })
					return interaction.reply({embeds: [inventoryEmbed]})
			}
			let page = interaction.options.getInteger('страница')
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
					let inventoryEmbed = client.utils.embed(`Инвентарь ${user.tag}`, inventoryss)
						.setFooter({ text: `${user.tag} • Страница ${page}/${pages}`, iconURL: user.displayAvatarURL({dynamic: true}) })
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
					let inventoryEmbed = client.utils.embed(`Инвентарь ${user.tag}`, inventoryss)
						.setFooter({ text: `${user.tag} • Страница ${page}/${pages}`, iconURL: user.displayAvatarURL({dynamic: true}) })
					return interaction.reply({embeds: [inventoryEmbed]})
				}
		} catch(error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Inventory;