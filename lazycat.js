const { registerPlayerEvents } = require('./events');
const chalk = require("chalk"); // библиотека для красивой консоли
console.log(chalk.hex("#B88FFF")(`[!] Загрузка файлов...`));
const fs = require("fs"); // чтение json файлов

const LazyCat = require('./class/LazyCat')
const client = new LazyCat();
registerPlayerEvents(client.player);

const LazyLoader = async () => {
	const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js')); // чтение папки events
	client.logger.log(`[!] DISCORD EVENTS`, "log")
	for (const file of eventFiles) {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.logger.log(`[!] Загружено событие ${file}`, "log")
		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];
	};
	client.logger.log(`[!] COMMANDS`, "log")
	fs.readdirSync("./commands/").forEach(dirs => {
		const allCommands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));
		for (const file of allCommands) {
			let command = require(`./commands/${dirs}/${file}`);
			client.logger.log(`[!] Загружена команда ${file}`, "log")
			client.commands.set(command.data.name, command);
			command.data.permissions.forEach(permission => {
				client.permissions.set(permission, command.data.name)
			});
		};
	});
	client.login(client.config.token);
};
setInterval(() =>{
	let transactions = exchange.boughtBugs + exchange.sellBugs;
	if(transactions > 9)
		exchange.currentBugPrice += client.randInt(1, 3);
	else {
		if (exchange.currentBugPrice > 30) {
			exchange.currentBugPrice -= client.randInt(1, 3);
		}
	}
	exchange.boughtBugs = 0;
	exchange.sellBugs = 0;
	client.saveJSON(exchange)
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