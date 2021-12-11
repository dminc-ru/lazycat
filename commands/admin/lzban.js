const { MessageEmbed, WebhookClient } = require("discord.js");
const webhookBan = new WebhookClient(client.config.webhookBan.id, client.config.webhookBan.token);
module.exports.run = async (client, message, args) => {
try{
	var user = await client.users.fetch(message.mentions.users.first());
	let noUser = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Ошибка')
		.setDescription('Не смог получить ID пользователя.')
	if (!user) {
		try {
		  user = await client.users.fetch(args[0])
		  if (!user) return message.channel.send(noUser);
		}
		catch (error) {
		  return message.channel.send(noUser);
		}
	}

	var userdb = await client.db.getUser(user.id);
	noUser = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Ошибка')
		.setDescripiton('Пользователь не найден в базе данных.')
	if (!userdb) return message.channel.send(noUser);
	if(member.permissions_lia == true) return;
	if(member.permissions_member == false) return;
	let reasonBan = args[1];
	if(!reasonBan)
		reasonBan = `Нарушение Пользовательского соглашения`;
	await client.db.changeUser(user.id, 'permissions_member', 0);
	await client.db.changeUser(user.id, 'permissions_tester', 0);
	await client.db.changeUser(user.id, 'permissions_lia', 0);
	await client.db.changeUser(user.id, 'permissions_developer', 0);
	let lazyBan = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Глобальная блокировка`)
		.setDescription(`Пользователь ${membermention.user.tag} успешно заблокирован в системе Lazy Cat.`)
   	message.channel.send(lazyBan);
	let newBan = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Пользователь заблокирован`)
		.setDescription(`Пользователю ограничен доступ к функциям`)
		.addField(`Причина`, `${reasonBan}`, false)
		.addField(`Срок`, `навсегда`, false)
		.addField(`Пользователь`, `${user.tag}`, true)
		.addField(`Модератор`, `${message.author.tag}`, true)
		.setFooter(`Moderator ID: ${message.author.id} • User ID: ${user.id}`);
	webhookBan.send(newBan);
	let lazyBanUser = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Глобальная блокировка`)
		.setDescription(client.messages.userBlocked)
		.addField(`Причина`, `${reasonBan}`, false)
		.addField(`Срок`, `навсегда`, true)
		.addField(`Модератор`, `${message.author.id}`, true)
	try {
		await client.users.fetch(user.id).send(lazyBanUser);
	} catch(error) {
		return;
	};
}catch(error){
			client.logger.log(`${error}`, "err")
		}
}

module.exports.data = {
	name: "lzban",
	permissions: ["lia"],
	type: "message"
}