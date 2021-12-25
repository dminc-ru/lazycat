const ms = require("ms");
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch(error) {
			return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
		}
		var members = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
		let pongEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Понг!')
			.setDescription(`Задержка: **${Math.round(client.ws.ping)}**мс\n
				${client.emoji.cloud} Серверов: ${client.guilds.cache.size}.
				${client.emoji.users} Пользователей: ${members}.
				${client.emoji.time} Аптайм: ${ms(client.uptime, {long: true})}`)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		interaction.reply({embeds: [pongEmbed]})
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
	}
}

module.exports.data = {
	name: "пинг",
	permissions: ["member"],
	type: "interaction"
}