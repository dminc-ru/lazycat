let stats = require(`${process.env.PATHTOBASE}/stats.json`);
module.exports.run = async (client, interaction) => {
	try{
		let user = client.users.cache.get(interaction.member.user.id);
		var members = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Информация о боте',
							description: `<a:lz_b:742046121169387531> Lazy Cat — универсальный бот-менеджер для вашего сервера Discord.\n
							<:lz_cloud:774302583564402748> Серверов: **${client.guilds.cache.size}**
							<:lz_users:774302509333348372> Пользователей: **${members}**
							<:lz_cmd:774302538626498580> Команд обработано: **${stats.commands}**\n
							Список доступных команд: **/помощь**
							[**Добавить на свой сервер**](https://discord.com/oauth2/authorize?client_id=707539807957680129&permissions=2666900726&scope=bot%20applications.commands)\n
							[Условия использования](https://dminc.ru/terms)\n[Политика конфиденциальности](https://dminc.ru/privacy)`,
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
	}catch(error){
			client.logger.log(`${error}`, "err");
		}
}

module.exports.help = {
	name: "инфо",
	aliases: ["byaj"],
	permissions: ["member"],
	modules: ["info"]
}