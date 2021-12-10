const { Client, Collection } = require("discord.js"); // подгрузка библиотеки discord.js
const chalk = require("chalk"); // библиотека для красивой консоли
console.log(chalk.hex("#B88FFF")(`[!] Загрузка файлов...`));
const fs = require("fs"); // чтение json файлов
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] }); // интенты для бота

client.config = require('./config')

client.commands = new Collection(); // коллекция команд
client.permissions = new Collection(); // коллекция прав юзеров
client.logger = require('./utils/logger'); // утилита для логов
client.db = require('./utils/db') // утилита для базы данных
client.emoji = require('./emojis') //кастом эмодзи

function LazyLoader() {
	const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js')); // чтение папки events
	const player = fs.readdirSync('./player').filter(file => file.endsWith('.js')); // чтение папки events для радио
	client.logger.log(`[!] MUSIC EVENTS`, "log")
	for (const file of player) {
		client.logger.log(`[!] Загружено событие ${file}`, "log");
		const event = require(`./player/${file}`);
		client.player.on(file.split(".")[0], event.bind(null, client));
	};
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
		const commandss = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));
		
		for (const file of commandss) {
			let props = require(`./commands/${dirs}/${file}`);
			client.logger.log(`[!] Загружена команда ${file}`, "log")
			client.commands.set(props.help.name, props);
			props.help.permissions.forEach(permission => {
				client.permissions.set(permission, props.help.name)
			});
		};
	});
	client.login(client.config.token);
};

LazyLoader();

let stats = require('./base/stats.json'); // статистика использования команд
let exchange = require('./base/exchange.json'); // курс обмена жучков
let shop = require('./base/shop.json'); // текущая витрина в магазине
let bans = require('./base/bans.json'); // база данных текущих банов
client.ws.on("INTERACTION_CREATE", async interaction => {
	if (!interaction.guild_id)
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `На данный момент команды можно использовать только на сервере.`
				}
			}
		});
	if(bans[interaction.member.user.id])
		return;
	var user = await client.db.get(interaction.member.user.id, 'users');
	let fetchedUser = await client.users.cache.get(interaction.member.user.id)
	if(!user){
		const add_user = await client.db.add(interaction.member.user.id, 'users');
		user = await client.db.get(interaction.member.user.id, 'users');
	}
	if(user.length == 0){
		client.logger.log(`Ошибка получения данных. User ID: ${interaction.member.user.id}`, 'err');
		console.log(user, user[0]);
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Произошла ошибка. Попробуйте ещё раз или обратитесь на наш сервер поддержки.\nКод ошибки: LZE-179`
				}
			}
		});
	}
	var guild = await client.db.get(interaction.guild_id, 'guilds');
	if(!guild){
		const add_guild = await client.db.add(interaction.guild_id, 'guilds')
		guild = await client.db.get(interaction.guild_id, 'guilds');
	}
	let commandfile = client.commands.get(interaction.data.name);
	if(commandfile) {
		switch (commandfile.permissions) {
			case 'member': {
				if(user.permissions_member != true)
					return;
				break;
			}
			case 'tester': {
				if(user.permissions_tester != true)
					return;
				break;
			}
			case 'lia': {
				if(user.permissions_lia != true)
					return;
				break;
			}
			case 'developer': {
				if(user.permissions_developer != true)
					return;
				break;
			}
			default: break;
		}

		stats.commands += 1;
		fs.writeFileSync("./base/stats.json", JSON.stringify(stats, null, "\t"));
		if(commandfile){
			client.logger.log(`INTERACTION || ${fetchedUser.tag} || ${interaction.member.user.id} || ${interaction.data.name}`, 'cmd')
			commandfile.run(client, interaction);
		}else{
			return; 
		};
	}
});


function randInt(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}
setInterval(() =>{
	let transactions = exchange.boughtBugs + exchange.sellBugs;
	if(transactions > 9)
		exchange.currentBugPrice += randInt(1, 3);
	else
		exchange.currentBugPrice -= randInt(1, 3);
	exchange.boughtBugs = 0;
	exchange.sellBugs = 0;
	fs.writeFileSync("./base/exchange.json", JSON.stringify(exchange, null, "\t"));
}, 86400000);
setInterval( async () => {
	let userTable = await client.db.getTable('users')
	userTable.forEach((user) => {
		if(user.shop_first == true)
			client.db.change(user.discord_id, 'users', 'shop_first', 0)
		if(user.shop_second == true)
			client.db.change(user.discord_id, 'users', 'shop_second', 0)
	})
}, 86400000);
setInterval(() => {
	for(var i = 0; i<=1; i++){
		let randomType = randInt(1, 4);
		if(randomType == 1){
			let checkit = randInt(1, 10);
			if(checkit == 1){
				let numCase = randInt(1, 2);
				if(numCase == 1){
					shop[i].name = "Лакикейс садовника";
					shop[i].cost = 20;
					shop[i].currency = "<:lz_bug:742039591929905223>";
					shop[i].type = "luckycase"
					shop[i].uid = 1;
				}else{
					shop[i].name = "Лакикейс «Школьная библиотека»";
					shop[i].cost = 20;
					shop[i].currency = "<:lz_bug:742039591929905223>";
					shop[i].type = "luckycase"
					shop[i].uid = 2;
				}
			}else{
				randomType = randInt(2, 4);
			}
		}
		if(randomType == 2){
			let numCase = randInt(1, 2);
			if(numCase == 1){
				shop[i].name = "Мегакейс садовника";
				shop[i].cost = 15;
				shop[i].currency = "<:lz_bug:742039591929905223>";
				shop[i].type = "megacase"
				shop[i].uid = 1;
			}
			if(numCase == 2){
				shop[i].name = "Мегакейс «Школьная библиотека»";
				shop[i].cost = 15;
				shop[i].currency = "<:lz_bug:742039591929905223>";
				shop[i].type = "megacase"
				shop[i].uid = 2;
			}
		}
		if(randomType == 3){
			let numItem = randInt(1, 2);
			if(numItem == 1){
				shop[i].name = "Кусочек янтаря";
				shop[i].cost = 90;
				shop[i].currency = "<:lz_fish:742459590087803010>";
				shop[i].type = "item"
				shop[i].uid = 5;
			}
			if(numItem == 2){
				shop[i].name = "Лопата";
				shop[i].cost = 25;
				shop[i].currency = "<:lz_fish:742459590087803010>";
				shop[i].type = "item"
				shop[i].uid = 2;
			}
		}
		if(randomType == 4){
			let numCost = randInt(90, 110);
			shop[i].name = "Жучок";
			shop[i].cost = numCost;
			shop[i].currency = "<:lz_fish:742459590087803010>";
			shop[i].type = "money"
			shop[i].uid = 0;
		}
	}
	fs.writeFileSync("./base/shop.json", JSON.stringify(shop, null, "\t"));
	client.logger.log(`Магазин обновлён.`, "log");
}, 86400000);