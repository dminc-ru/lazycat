const fs = require("fs");
let exchange = require(`${process.env.PATHTOBASE}/exchange.json`);
module.exports.run = async (client, interaction) => {
	try{
		let user = client.users.cache.get(interaction.member.user.id);
		var whattoDo = interaction.data.options[0].name;
		if(bugs < 1){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Укажите корректное количество <:lz_bug:742039591929905223>.`
					}
				}
			});
		}
		if(users[interaction.member.user.id].balance < count){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `У вас недостаточно средств.`
					}
				}
			});
		}
		if(whattoDo == "купить"){
			let userdb = await client.db.get(interaction.member.user.id, 'users')	
			let clientdb = await client.db.get(client.user.id, 'users')

			var bugs = interaction.data.options[0].options[0].value;
			var count = bugs * exchange.currentBugPrice; 

			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish - count))
			client.db.change(client.user.id, 'users', 'balance_fish', (clientdb.balance_fish + count))
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_bugs + bugs))
			exchange.boughtBugs += bugs;
			fs.writeFileSync(`${process.env.PATHTOBASE}\\exchange.json`, JSON.stringify(exchange, null, "\t"));
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Транзакция',
								description: `Успешно! Куплено ${bugs} <:lz_bug:742039591929905223> за ${count} <:lz_fish:742459590087803010>.`,
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
		if(whattoDo == "продать"){
			let userdb = await client.db.get(interaction.member.user.id, 'users')
			let clientdb = await client.db.get(client.user.id, 'users')

			var bugs = interaction.data.options[0].options[0].value;
			var count = bugs * exchange.currentBugPrice; 

			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_bugs - bugs))
			client.db.change(client.user.id, 'users', 'balance_fish', (clientdb.balance_bugs + bugs))
			client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + count))
			exchange.sellBugs += bugs;
			fs.writeFileSync(`${process.env.PATHTOBASE}\\exchange.json`, JSON.stringify(exchange, null, "\t"));
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Транзакция',
								description: `Успешно! Продано ${bugs} <:lz_bug:742039591929905223> за ${count} <:lz_fish:742459590087803010>.`,
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
		if(whattoDo == "курс"){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Жучки',
								description: `Текущий курс обмена жучков:\n1 <:lz_bug:742039591929905223> = ${exchange.currentBugPrice} <:lz_fish:742459590087803010>\n\n/жучки купить <кол-во>\n/жучки продать <кол-во>`,
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
		}
}

module.exports.help = {
	name: "жучки",
	aliases: [";exrb"],
	permissions: ["member"],
	modules: ["economy"]
}