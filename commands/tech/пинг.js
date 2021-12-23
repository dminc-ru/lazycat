const ms = require("ms");
module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	var members = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
	let pongEmbed = new MessageEmbed()
		.setTitle('Понг!')
		.setDescription(`Задержка: **${Math.round(client.ws.ping)}**мс\n
			${client.emoji.cloud} Серверов: ${client.guilds.cache.size}.
			${client.emoji.users} Пользователей: ${members}.
			${client.emoji.time} Аптайм: ${ms(client.uptime, {long: true})}\n
			${client.emoji.music} Радио: работает в ${client.voice.connections.size} серв.`)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	interaction.reply({embeds: [pongEmbed]})
}

module.exports.data = {
	name: "пинг",
	permissions: ["member"],
	type: "interaction"
}