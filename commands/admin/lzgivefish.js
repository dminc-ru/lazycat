const { MessageEmbed } = require("discord.js");
let stats = require(`${process.env.PATHTOBASE}/stats.json`);
module.exports.run = async (client, message, args) => {
try{
	let memberResolve = message.mentions.members.first()
	var money = args[1];
	let comment = args[2];
	let embedFound = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle('Ошибка')
		.setDescription(`Пользователь не найден.`)
		.setTimestamp()
		.setFooter(`${stats.version}`, client.user.avatarURL());
	let noFish = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle('Ошибка')
		.setDescription(`Укажите корректное количество рыбок.`)
		.setTimestamp()
		.setFooter(`${stats.version}`, client.user.avatarURL());
	let noMoney = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle('Ошибка')
		.setDescription(`Недостаточно средств.`)
		.setTimestamp()
		.setFooter(`${stats.version}`, client.user.avatarURL());
	if(message.author.id != '561822820632494081')
		if(message.author.id != '305320807515815937')
			return;
	
	if(!memberResolve)
		return message.channel.send(embedFound);
	var user = await client.db.get(memberResolve.id, 'users');

	if (!user) return message.channel.send(embedFound);

	if(!args[1])
		return message.channel.send(noFish);
	money = Number(args[1]);
	if ((money > 10000) || (money == 0) || (money < 0) || (money % 1 != 0))
		return message.channel.send(noFish); 
	
	let clientik = await client.db.get(client.user.id, 'users');
	if(clientik.balance_fish < money)
		return message.channel.send(noMoney);
	let success = await client.db.change(client.user.id, 'users', 'balance_fish', (clientik.balance_fish - money))
	success = await client.db.change(user.discord_id, 'users', 'balance_fish', (user.balance_fish + money))
	let embedMember = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle('Транзакция')
		.setDescription(`Вам зачислено ${money} <:lz_fish:742459590087803010>. Отправитель: ${client.user.tag}. Комментарий: ${comment}`)
		.setTimestamp()
		.setFooter(`${stats.version}`, client.user.avatarURL());
	memberResolve.send(embedMember);
	let embedEdit = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle('Транзакция')
		.setDescription(`Успешно! Переведено ${money} <:lz_fish:742459590087803010>. Комментарий: ${comment}`)
		.setTimestamp()
		.setFooter(`${stats.version}`, client.user.avatarURL());
	message.channel.send(embedEdit);
}catch(error){
			client.logger.log(`${error}`, "err")
		}
}

module.exports.help = {
	name: "lzgivefish",
	aliases: [],
	permissions: ["lia"],
	modules: ["admin"]
}