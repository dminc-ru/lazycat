const { registerPlayerEvents } = require('./events');
const chalk = require("chalk"); // библиотека для красивой консоли
console.log(chalk.hex("#B88FFF")(`[!] Загрузка файлов...`));

const LazyCat = require('./class/LazyCat')
const client = new LazyCat();
registerPlayerEvents(client.player);

client.LazyLoader();

setInterval(() =>{
	let transactions = exchange.boughtBugs + exchange.sellBugs;
	if(transactions > 9) {
		exchange.currentBugPrice += Math.floor(exchange.boughtBugs * (0.006))
		exchange.currentBugPrice -= Math.floor(exchange.sellBugs * (0.002))
		if (exchange.currentBugPrice < 30) {
			exchange.currentBugPrice = 30
		}
	}
	exchange.boughtBugs = 0;
	exchange.sellBugs = 0;
	fs.writeFileSync(`${client.config.jsonPath}exchange.json`, JSON.stringify(exchange, null, "\t"));
}, 600000);
setInterval(() =>{
	if (exchange.currentBugPrice >= 30) {
		exchange.currentBugPrice -= randInt(1, 3)
	}
	fs.writeFileSync(`${client.config.jsonPath}exchange.json`, JSON.stringify(exchange, null, "\t"));
}, 86400000);

setInterval( async () => {
	let userTable = await client.db.getTable('users')
	userTable.forEach((user) => {
		if(user.shop_first == true)
			client.db.changeUser(user.discord_id, 'shop_first', 0)
		if(user.shop_second == true)
			client.db.changeUser(user.discord_id, 'shop_second', 0)
	})
}, 86400000);
setInterval(() => {
	for(var i = 0; i<=1; i++){
		let randomType = client.randInt(1, 4);
		if(randomType == 1){
			let checkit = client.randInt(1, 10);
			if(checkit == 1){
				let numCase = client.randInt(1, 2);
				if(numCase == 1){
					shop[i].name = "Лакикейс садовника";
					shop[i].cost = 20;
					shop[i].currency = client.emoji.bug;
					shop[i].type = "luckycase"
					shop[i].uid = 1;
				}else{
					shop[i].name = "Лакикейс «Школьная библиотека»";
					shop[i].cost = 20;
					shop[i].currency = client.emoji.bug;
					shop[i].type = "luckycase"
					shop[i].uid = 2;
				}
			}else{
				randomType = client.randInt(2, 4);
			}
		}
		if(randomType == 2){
			let numCase = client.randInt(1, 2);
			if(numCase == 1){
				shop[i].name = "Мегакейс садовника";
				shop[i].cost = 15;
				shop[i].currency = client.emoji.bug;
				shop[i].type = "megacase"
				shop[i].uid = 1;
			}
			if(numCase == 2){
				shop[i].name = "Мегакейс «Школьная библиотека»";
				shop[i].cost = 15;
				shop[i].currency = client.emoji.bug;
				shop[i].type = "megacase"
				shop[i].uid = 2;
			}
		}
		if(randomType == 3){
			let numItem = randInt(1, 2);
			if(numItem == 1){
				shop[i].name = "Кусочек янтаря";
				shop[i].cost = 90;
				shop[i].currency = client.emoji.fish;
				shop[i].type = "item"
				shop[i].uid = 5;
			}
			if(numItem == 2){
				shop[i].name = "Лопата";
				shop[i].cost = 25;
				shop[i].currency = client.emoji.fish;
				shop[i].type = "item"
				shop[i].uid = 2;
			}
		}
		if(randomType == 4){
			let numCost = client.randInt(90, 110);
			shop[i].name = "Жучок";
			shop[i].cost = numCost;
			shop[i].currency = client.emoji.fish;
			shop[i].type = "money"
			shop[i].uid = 0;
		}
	}
	client.saveJSON(shop);
	client.logger.log(`Магазин обновлён.`, "log");
}, 86400000);