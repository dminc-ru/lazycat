const { MessageEmbed, WebhookClient } = require("discord.js");
module.exports.run = async (client, message, args) => {
	const webhookBan = new WebhookClient(client.config.webhookBanID, client.config.webhookBanToken);
	const argus = message.content.split(' ').slice(1);
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
	let reasonUnban = argus.slice(1).join(' ');
	if(!reasonUnban)
		reasonUnban = `Рассмотрение апелляции`
	client.db.changeUser(user.discord_id, 'permissions_member', 1);
	let lazyBan = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Глобальная разблокировка`)
		.setDescription(`Пользователь ${user.tag} успешно разблокирован в системе Lazy Cat.`)
	message.channel.send(lazyBan)
	let newUnban = new MessageEmbed()
		.setColor("#8b0000")
		.setTitle(`Пользователь разблокирован`)
		.setDescription(`Пользователю предоставлен доступ к функциям`)
		.addField(`Причина`, `${reasonUnban}`, false)
		.addField(`Пользователь`, `${user.tag}`, true)
		.addField(`Модератор`, `${message.author.tag}`, true)
		.setFooter(`Moderator ID: ${message.author.id} • User ID: ${user.id}`)
		.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
	webhookBan.send(newUnban);
	let lazyUnbanUser = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Глобальная разблокировка`)
		.setDescription(`**Вы разблокированы в системе Lazy Cat.** Это означает, что вам предоставлен доступ к функциям Lazy Cat.`)
		.addField(`Причина`, `${reasonUnban}`, true)
		.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
	try{
		await client.users.fetch(user.id).send(lazyUnbanUser);
	} catch (error) {
		return;
	};
}
module.exports.data = {
	name: "lzunban",
	permissions: ["lia"],
	type: "message"
}