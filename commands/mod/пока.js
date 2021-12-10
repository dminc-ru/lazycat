module.exports.run = async (client, interaction) => {
try{
	let guild = client.guilds.cache.get(interaction.guild_id);
	let guilddb = await client.db.get(interaction.guild_id, 'guilds')
	let user = client.users.cache.get(interaction.member.user.id);
	let member = guild.members.cache.get(interaction.member.user.id);
	var whattoDo = interaction.data.options[0].name;
	if(!member.hasPermission('ADMINISTRATOR'))
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `У вас недостаточно прав для выполнения этой команды.`
				}
			}
		});
	if(whattoDo == "чат"){
		let newChannel = interaction.data.options[0].options[0].value;
		client.db.change(interaction.guild_id, 'guilds', 'farewellChannel', newChannel)
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Успешно',
							description: `Канал для оповещений о покинувших сервер участниках установлен.`,
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
	if(whattoDo == "мсг"){
		if(guilddb.farewellChannel == '') 
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Установите текстовый канал для оповещений: /пока чат <#канал>`
				}
			}
		});
		client.db.change(interaction.guild_id, 'guilds', 'farewellText', interaction.data.options[0].options[0].value)
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Успешно',
							description: `Текст оповещения о покинувших сервер участниках установлен.`,
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
}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "пока",
	aliases: ["gjrf"],
	permissions: ["member"],
	modules: ["tech"]
}