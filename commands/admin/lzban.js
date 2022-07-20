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
			let noUser = client.utils.error(client.messages.userNotFound, message.author)
			try {
				var user = await client.users.cache.get((message.mentions.users.first() || args[0])) || await client.users.fetch((message.mentions.users.first() || args[0]));
			} catch (error) {
				return message.channel.send({embeds: [noUser]})
			}
			let userdb = await client.db.getUser(user.id);
			if (!userdb) return message.channel.send({embeds: [noUser]});
			if (userdb.banned == true) {
				let bannedAlready = client.utils.error(client.messages.userAlreadyBanned, message.author)
				return message.channel.send({embeds: [bannedAlready]})
			}
			let reasonBan = message.content.slice(2) || client.messages.userAgreementViolation
			await client.db.changeUser(user.id, 'banned', 1);
			let lazyBan = client.utils.success(`Пользователь ${user.tag} успешно заблокирован в системе Lazy Cat.`)
			message.channel.send({embeds: [lazyBan]});
			let newBan = client.utils.embed(client.messages.userBlocked, client.messages.userFunctionsPaused)
				.addField(client.messages.reasonCapital, `${reasonBan}`, false)
				.addField(client.messages.blocktimeCapital, client.messages.forever, false)
				.addField(client.messages.userCapital, `${user.tag} (${user.id})`, true)
				.addField(client.messages.moderatorCapital, `${message.author.tag} (${message.author.id})`, true)
			webhookBan.send({embeds: [newBan]});
			let lazyBanUser = client.utils.embed('Глобальная блокировка', client.messages.userBlocked)
				.addField(client.messages.reasonCapital, `${reasonBan}`, false)
				.addField(client.messages.blocktimeCapital, `навсегда`, true)
				.addField(client.messages.moderatorCapital, `${message.author.id}`, true)
			try {
				await client.users.fetch(user.id).send({embeds: [lazyBanUser]});
			} catch(error) {
				return;
			};
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			message.channel.send({ content: client.messages.commandError })
		}
	}
}
module.exports = Lzban;