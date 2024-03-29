const Command = require('../../class/Command')
class Case extends Command {
	constructor(client) {
		super(client, {
			name: 'кейс',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: false
		})
	}

	async run (client, interaction) {
		try {
			let cases = client.json.cases;
			let inventory = client.json.inventory;
			let noUser = client.utils.error('Пользователь не найден в базе данных.')
			try {
				var user = await client.users.fetch(interaction.member.user.id);
			} catch (error) {
				return interaction.reply({embeds: [noUser], ephemeral: true})
			}
			var IDcase = interaction.options.getInteger('номер');
			let memIndex1 = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == "1"));
			let memIndex2 = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == "2"));
			let numberOfCase1 = inventory[interaction.member.user.id].cases[memIndex1].count;
			let numberOfCase2 = inventory[interaction.member.user.id].cases[memIndex2].count;
			if(!IDcase) {
				let availableCases = client.utils.embed('Кейсы', 
						`Доступные кейсы:
						1. ${client.emoji.tree} Кейс садовника • ${cases[1].cost} ${cases[1].currency} • У вас: ${numberOfCase1} шт.
						2. ${client.emoji.cmd} Школьная библиотека • ${cases[2].cost} ${cases[2].currency} • У вас: ${numberOfCase2} шт.`, user)
					.addField(`Редкости:`, `${client.emoji.ph} Обычный ${client.emoji.ph}
						${client.emoji.bh} Стандартный ${client.emoji.bh}
						${client.emoji.gh} __Особый__ ${client.emoji.gh}
						${client.emoji.yh} *Редкий* ${client.emoji.yh}
						${client.emoji.oh} **Тайный** ${client.emoji.oh}
						${client.emoji.rh} ***Легендарный*** ${client.emoji.rh}`, true)
					.addField(`Команды`, `Открыть: /кейс <номер_кейса>
					Купить кейсы: /магазин кейс <номер_кейса> <кол-во>`, true)
				return interaction.reply({embeds: [availableCases]})
			}
			if( (IDcase < 1) || (!cases[IDcase]) )
				return interaction.reply({content: "Введите корректный номер кейса.", ephemeral: true})
			let memIndex = inventory[interaction.member.user.id].cases.findIndex((obj => obj.caseID == IDcase));
			let balances = Number(inventory[interaction.member.user.id].cases[memIndex].count);
			if(balances > 0){
				inventory[interaction.member.user.id].cases[memIndex].count -= 1;
				await client.saveJSON('inventory', inventory)
			}else{
				return interaction.reply({content: "У вас нет этого кейса.", ephemeral: true})
			}
			let chuck = client.utils.randInt(1, 100);
			if(chuck == 1){
				var chuck1 = client.utils.randInt(1, 100);
					if(chuck1 == 2){
						var result = 30;
				}else{
					var chuck2 = client.utils.randInt(1, 100);
					if(chuck2 == 5)
						var result = client.utils.randInt(25, 29)
					else{var result = client.utils.randInt(0, 4)}
				}
			}
			if(chuck >= 2 && chuck <= 4){
				var result = client.utils.randInt(20, 24);
			}
			if(chuck >= 5 && chuck <= 12){
				var result = client.utils.randInt(15, 19);
			}
			if(chuck >= 13 && chuck <= 25){
				var result = client.utils.randInt(10, 14);
			}
			if(chuck >= 26 && chuck <= 49){
				var result = client.utils.randInt(5, 9);
			}
			if(chuck >= 50 && chuck <= 100){
				var result = client.utils.randInt(0, 4);
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
			switch(cases[IDcase].items[result].class) {
				case 'Обычный': {
					var resheart = client.emoji.ph;
					var resclass = cases[IDcase].items[result].class;
					break;
				}
				case 'Стандартный': {
					var resheart = client.emoji.bh;
					var resclass = cases[IDcase].items[result].class;
					break;
				}
				case 'Особый': {
					var resheart = client.emoji.gh;
					var resclass = `__${cases[IDcase].items[result].class}__`;
					break;
				}
				case 'Редкий': {
					var resheart = client.emoji.yh;
					var resclass = `*${cases[IDcase].items[result].class}*`;
					break;
				}
				case 'Тайный': {
					var resheart = client.emoji.oh;
					var resclass = `**${cases[IDcase].items[result].class}**`;
					break;
				}
				case 'Легендарный': {
					var resheart = client.emoji.rh;
					var resclass = `***${cases[IDcase].items[result].class}***`;
					break;
				}
				case 'ОфИгЕнНоЕ': {
					var resheart = client.emoji.wh.repeat(5);
					var resclass = `__***~~${cases[IDcase].items[result].class}~~***__`;
					break;
				}
			}
			let comlength = Object.keys(inventory[interaction.member.user.id].items).length;
			var checks;
			for(var i = 0; i<comlength; i++){
				if(inventory[interaction.member.user.id].items[i].itemname == cases[IDcase].items[result].name){
					inventory[interaction.member.user.id].items[i].county += 1;
					await client.saveJSON('inventory', inventory)
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
			await client.saveJSON('inventory', inventory)
			let newItem = client.utils.embed('Кейсы', `Поздравляем! Вам выпал предмет: ${cases[IDcase].items[result].name}`)
				.addField(`Описание`, cases[IDcase].items[result].description, false)
				.addField(`Класс`, `${resheart} ${resclass} ${resheart}`, true)
				.addField(`Стоимость`, `${cases[IDcase].items[result].cost} ${cases[IDcase].items[result].currency}`, true)
				.addField(`Кейс`, cases[IDcase].name)
				.setThumbnail(cases[IDcase].items[result].image)
				.setFooter({text: `${user.tag} • /инвентарь`, iconURL: user.displayAvatarURL({dynamic: true}) })
			return interaction.reply({embeds: [newItem]})
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Case;