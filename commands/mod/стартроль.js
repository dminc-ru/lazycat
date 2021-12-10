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
	if(whattoDo == 'выкл'){
		if(guilddb.giveRole == "false"){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Автоматическая выдача роли уже отключена. Включить — /стартроль вкл`
					}
				}
			});
		}
		if(guilddb.welcomeRole == ''){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Сначала необходимо установить роль — /стартроль установить <@Роль>`
					}
				}
			});
		}
		client.db.change(interaction.guild_id, 'guilds', 'giveRole', 'false')
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Успешно',
							description: `Автоматическая выдача роли новым участникам отключена. Включить снова - /стартроль вкл`,
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
	if(whattoDo == 'вкл'){
		if(guilddb.giveRole == 'true'){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Автоматическая выдача роли уже включена. Отключить — /стартроль выкл`
					}
				}
			});
		}
		if(guilddb.welcomeRole == ''){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Сначала необходимо установить роль — /стартроль установить @Роль`
					}
				}
			});
		}
		client.db.change(interaction.guild_id, 'guilds', 'giveRole', 'true')
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Успешно',
							description: `Автоматическая выдача роли новым участникам включена. Отключить — /стартроль выкл`,
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
	startRole = interaction.data.options[0].options[0].value;
	client.db.change(interaction.guild_id, 'guilds', 'welcomeRole', startRole)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: 'Успешно',
						description: `Теперь эта роль будет выдаваться всем участникам. Выдачу роли можно отключить командой /стартроль выкл`,
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
	name: "стартроль",
	aliases: ["cnfhnhjkm"],
	permissions: ["member"],
	modules: ["tech"]
}