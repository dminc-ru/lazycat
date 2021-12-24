const { MessageEmbed, WebhookClient } = require("discord.js");
module.exports.run = async (client, message, args) => {
	const webhookBan = new WebhookClient({id: client.config.webhookBan.id, token: client.config.webhookBan.token});
	let noUser = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Ошибка')
		.setDescription('Не смог получить ID пользователя.')
	try{
		var user = await client.users.fetch((message.mentions.users.first() || args[0]));
	} catch (error) {
		return message.channel.send({embeds: [noUser]})
	}
	var userdb = await client.db.getUser(user.id);
	var bannedAlready = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Ошибка')
		.setDescription('Пользователь не заблокирован.')
	if (!userdb) return message.channel.send({embeds: [noUser]});
	if (userdb.banned == false) {
		return message.channel.send({embeds: [bannedAlready]})
	}
	let reasonUnban = message.content.split(' ').slice(2).join(' ')
	if(!reasonUnban)
		reasonUnban = `Рассмотрение апелляции`
	await client.db.changeUser(user.id, 'banned', 0);
	let lazyBan = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Глобальная разблокировка`)
		.setDescription(`Пользователь ${user.tag} успешно разблокирован в системе Lazy Cat.`)
	message.channel.send({embeds: [lazyBan]});
	let newUnban = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Пользователь разблокирован`)
		.setDescription(`Пользователю предоставлен доступ к функциям`)
		.addField(`Причина`, `${reasonUnban}`, false)
		.addField(`Пользователь`, `${user.tag}`, true)
		.addField(`Модератор`, `${message.author.tag}`, true)
		.setFooter(`User ID: ${user.id} • Moderator ID: ${message.author.id}`)
	webhookBan.send({embeds: [newUnban]});
	let lazyUnbanUser = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Глобальная разблокировка`)
		.setDescription(`**Вы разблокированы в системе Lazy Cat.** Это означает, что вам предоставлен доступ к функциям Lazy Cat.`)
		.addField(`Причина`, `${reasonUnban}`, true)
	try{
		await client.users.fetch(user.id).send({embeds: [lazyUnbanUser]});
	} catch (error) {
		return;
	};
}
module.exports.data = {
	name: "lzunban",
	permissions: ["lia"],
	type: "message"
}