const Command = require('../../class/Command');
const { WebhookClient } = require("discord.js");
class Lzban extends Command {
	constructor (client) {
		super(client, {
			name: "lzban",
			permissions: ["lia"],
			type: "message",
			enabled: true,
			guildOnly: false
		});
	}
	
	async run (client, message, args) {
		try {
			const webhookBan = new WebhookClient({id: client.config.webhookBan.id, token: client.config.webhookBan.token})
			let noUser = client.utils.error('Пользователь не найден в базе данных.', message.author)
			try {
				var user = await client.users.cache.get((message.mentions.users.first() || args[0])) || await client.users.fetch((message.mentions.users.first() || args[0]));
			} catch (error) {
				return message.channel.send({embeds: [noUser]})
			}
			let userdb = await client.db.getUser(user.id);
			if (!userdb) return message.channel.send({embeds: [noUser]});
			if (userdb.banned == true) {
				let bannedAlready = client.utils.error('Пользователь уже заблокирован.', message.author)
				return message.channel.send({embeds: [bannedAlready]})
			}
			let reasonBan = message.content.slice(2) || `Нарушение Пользовательского соглашения`
			await client.db.changeUser(user.id, 'banned', 1);
			let lazyBan = client.utils.success(`Пользователь ${user.tag} успешно заблокирован в системе Lazy Cat.`)
			message.channel.send({embeds: [lazyBan]});
			let newBan = client.utils.embed('Пользователь заблокирован', 'Пользователю ограничен доступ к функциям')
				.addField(`Причина`, `${reasonBan}`, false)
				.addField(`Срок`, `навсегда`, false)
				.addField(`Пользователь`, `${user.tag} (${user.id})`, true)
				.addField(`Модератор`, `${message.author.tag} (${message.author.id})`, true)
			webhookBan.send({embeds: [newBan]});
			let lazyBanUser = client.utils.embed('Глобальная блокировка', client.messages.userBlocked)
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
			message.channel.send({ content: `Произошла ошибка при выполнении команды.`})
		}
	}
}
module.exports = Lzban;