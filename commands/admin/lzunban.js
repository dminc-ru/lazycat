const { WebhookClient } = require("discord.js");
const Command = require('../../class/Command')
class Lzunban extends Command {
	constructor(client) {
		super(client, {
			name: 'lzunban',
			permissions: ['lia'],
			type: 'message',
			enabled: true,
			guildOnly: false
		})
	}

	async run (client, message, args) {
		try {
			const webhookBan = new WebhookClient({id: client.config.webhookBan.id, token: client.config.webhookBan.token});
			let noUser = client.utils.error('Не смог получить ID пользователя.', message.author)
			try{
				var user = await client.users.fetch((message.mentions.users.first() || args[0]));
			} catch (error) {
				return message.channel.send({embeds: [noUser]})
			}
			let userdb = await client.db.getUser(user.id);
			let bannedAlready = client.utils.error('Пользователь не заблокирован.', message.author)
			if (!userdb) return message.channel.send({embeds: [noUser]});
			if (userdb.banned == false) {
				return message.channel.send({embeds: [bannedAlready]})
			}
			let reasonUnban = message.content.slice(2) || `Рассмотрение апелляции`
			await client.db.changeUser(user.id, 'banned', 0);
			let lazyBan = client.utils.embed('Глобальная разблокировка', `Пользователь ${user.tag} успешно разблокирован в системе Lazy Cat.`, message.author)
			message.channel.send({embeds: [lazyBan]});
			let newUnban = client.utils.embed('Пользователь разблокирован', 'Пользователю предоставлен доступ к функциям', message.author)
				.addField(`Причина`, `${reasonUnban}`, false)
				.addField(`Пользователь`, `${user.tag} (${user.id})`, true)
				.addField(`Модератор`, `${message.author.tag} (${message.author.id})`, true)
			webhookBan.send({embeds: [newUnban]});
			let lazyUnbanUser = client.utils.embed('Глобальная разблокировка', '**Вы разблокированы в системе Lazy Cat.** Это означает, что вам предоставлен доступ к функциям Lazy Cat.')
				.addField(`Причина`, `${reasonUnban}`, true)
			try{
				await client.users.fetch(user.id).send({embeds: [lazyUnbanUser]});
			} catch (error) {
				return;
			};
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			message.channel.send({ content: `Произошла ошибка при выполнении команды.`})
		}
	}
}

module.exports = Lzunban;