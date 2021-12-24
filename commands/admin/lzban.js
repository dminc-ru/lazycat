const { MessageEmbed, WebhookClient } = require("discord.js");
module.exports.run = async (client, message, args) => {
	try {
		const webhookBan = new WebhookClient({id: client.config.webhookBan.id, token: client.config.webhookBan.token})
		let noUser = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Ошибка')
			.setDescription('Пользователь не найден в базе данных.')
		try{
			var user = await client.users.fetch((message.mentions.users.first() || args[0]));
		} catch (error) {
			return message.channel.send({embeds: [noUser]})
		}
		var userdb = await client.db.getUser(user.id);
		var bannedAlready = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Ошибка')
			.setDescription('Пользователь уже заблокирован.')
		if (!userdb) return message.channel.send({embeds: [noUser]});
		if (userdb.banned == true) {
			return message.channel.send({embeds: [bannedAlready]})
		}
		let reasonBan = message.content.split(' ').slice(2).join(' ');
		if(!reasonBan)
			reasonBan = `Нарушение Пользовательского соглашения`;
		await client.db.changeUser(user.id, 'banned', 1);
		let lazyBan = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`Глобальная блокировка`)
			.setDescription(`Пользователь ${user.tag} успешно заблокирован в системе Lazy Cat.`)
		message.channel.send({embeds: [lazyBan]});
		let newBan = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`Пользователь заблокирован`)
			.setDescription(`Пользователю ограничен доступ к функциям`)
			.addField(`Причина`, `${reasonBan}`, false)
			.addField(`Срок`, `навсегда`, false)
			.addField(`Пользователь`, `${user.tag}`, true)
			.addField(`Модератор`, `${message.author.tag}`, true)
			.setFooter(`User ID: ${user.id} • Moderator ID: ${message.author.id}`);
		webhookBan.send({embeds: [newBan]});
		let lazyBanUser = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`Глобальная блокировка`)
			.setDescription(client.messages.userBlocked)
			.addField(`Причина`, `${reasonBan}`, false)
			.addField(`Срок`, `навсегда`, true)
			.addField(`Модератор`, `${message.author.id}`, true)
		try {
			await client.users.fetch(user.id).send({embeds: [lazyBanUser]});
		} catch(error) {
			return;
		};
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
	}
}

module.exports.data = {
	name: "lzban",
	permissions: ["lia"],
	type: "message"
}