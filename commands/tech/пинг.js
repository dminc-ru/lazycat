const ms = require("ms");
module.exports.run = async (client, interaction) => {
	try{
		let user = client.users.cache.get(interaction.member.user.id);
		var members = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
				embeds: [
						{
							color: 0xb88fff,
							title: 'Понг!',
							description: `Задержка: **${Math.round(client.ws.ping)}**мс\n
							<:lz_cloud:774302583564402748> Серверов: ${client.guilds.cache.size}.
							<:lz_users:774302509333348372> Пользователей: ${members}.
							<:lz_time:774532168138489856> Аптайм: ${ms(client.uptime, {long: true})}\n
							<:lz_music:817396644471111690> Радио: работает в ${client.voice.connections.size} серв.`,
							timestamp: new Date(),
							footer: {
								text: `${user.tag}`,
								icon_url: `${user.displayAvatarURL()}`,
							}
						}
					]
				}
			}
		});
	}
	catch(error){
		client.logger.log(`${error}`, "err");
		console.log(error)
	}
}

module.exports.help = {
	name: "пинг",
	aliases: ["gbyu"],
	permissions: ["member"],
	modules: ["tech"]
}