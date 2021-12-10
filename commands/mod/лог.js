module.exports.run = async (client, interaction) => {
try{
	let user = client.users.cache.get(interaction.member.user.id);
	let guild = client.guilds.cache.get(interaction.guild_id);
	let guilddb = await client.db.get(interaction.guild_id, 'guilds')
	let member = guild.members.cache.get(interaction.member.user.id);
	var typeLog = interaction.data.options[0].name;
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
	if(typeLog == "чат"){
		client.db.change(interaction.guild_id, 'guilds', 'logmsg_channel', interaction.data.options[0].options[1].value)
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Успешно',
							description: `Канал для логов установлен. Теперь туда будут отправляться сообщения о действиях модераторов.`,
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
	if(typeLog == "мсг"){
		let typeAction = interaction.data.options[0].options[0].name;
		if(typeAction == "вкл"){
			if(guilddb.logmsg_enable == 'false'){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Аудит сообщений уже включен. Включить — /лог мсг выкл`
						}
					}
				});
			}
			if(guilddb.logmsg_channel == ''){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Сначала необходимо установить канал для логов — /лог чат <#канал>`
						}
					}
				});
			}
			client.db.change(interaction.guild_id, 'guilds', 'logmsg_enable', 'true')
			client.db.change(interaction.guild_id, 'guilds', 'logmsg_type_edit', 'false')
			client.db.change(interaction.guild_id, 'guilds', 'logmsg_type_delete', 'true')
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Аудит сообщений включён. Отключить — /лог мсг выкл`,
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
		if(typeAction == "выкл"){
			if(guilddb.logmsg_enable == 'false'){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Аудит сообщений уже выключен. Включить — /лог мсг вкл`
						}
					}
				});
			}
			if(guilddb.logmsg_channel == ''){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Сначала необходимо установить канал для логов — /лог чат <#канал>`
						}
					}
				});
			}
			client.db.change(interaction.guild_id, 'guilds', 'logmsg_enable', 'false')
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Успешно',
								description: `Аудит сообщений выключен. Включить снова — /лог мсг вкл`,
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
		if(typeAction == "удалить"){
			let subTypeAction = interaction.data.options[0].options[0].options[0].name;
			if(guilddb.logmsg_enable == 'false'){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Сначала нужно включить аудит сообщений — /логмсг вкл`
						}
					}
				});
			}
			if(guilddb.logmsg_channel == ''){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Сначала необходимо установить канал для логов — /лог чат <#канал>`
						}
					}
				});
			}
			if(subTypeAction == "вкл"){
				if(guilddb.logmsg_type_delete == 'true'){
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								flags: 64,
								content: `Аудит удаления сообщений уже включен. Выключить — /лог мсг удалить выкл`
							}
						}
					});
				}
				client.db.change(interaction.guild_id, 'guilds', 'logmsg_type_delete', 'true')
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [
								{
									color: 0xb88fff,
									title: 'Успешно',
									description: `Аудит удаления сообщений включен. Выключить — /лог мсг удалить выкл`,
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
			if(subTypeAction == "выкл"){
				if(guilddb.logmsg_type_delete == 'false'){
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								flags: 64,
								content: `Аудит удаления сообщений уже выключен. Включить — /лог мсг удалить вкл`
							}
						}
					});
				}
				client.db.change(interaction.guild_id, 'guilds', 'logmsg_type_delete', 'false')
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [
								{
									color: 0xb88fff,
									title: 'Успешно',
									description: `Аудит удаления сообщений выключен. Включить — /лог мсг удалить вкл`,
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
		}
		if(typeAction == "эдит"){
			let subTypeAction = interaction.data.options[0].options[0].options[0].name;
			if(guilddb.logmsg_enable == 'false'){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Сначала нужно включить аудит сообщений — /лог мсг вкл`
						}
					}
				});
			}
			if(guilddb.logmsg_channel == ''){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Сначала необходимо установить канал для логов — /лог чат <#канал>`
						}
					}
				});
			}
			if(subTypeAction == "вкл"){
				if(guilddb.logmsg_type_edit == 'true'){
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								flags: 64,
								content: `Аудит редактирования сообщений уже включен. Выключить — /лог мсг эдит выкл`
							}
						}
					});
				}
				client.db.change(interaction.guild_id, 'guilds', 'logmsg_type_edit', 'true')
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [
								{
									color: 0xb88fff,
									title: 'Успешно',
									description: `Аудит редактирования сообщений включен. Выключить — /лог мсг эдит выкл`,
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
			if(subTypeAction == "выкл"){
				if(guilddb.logmsg_type_edit == 'false'){
					return client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 4,
							data: {
								flags: 64,
								content: `Аудит редактирования сообщений уже выключен. Включить — /лог мсг эдит вкл`
							}
						}
					});
				}
				client.db.change(interaction.guild_id, 'guilds', 'logmsg_type_edit', 'false')
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [
								{
									color: 0xb88fff,
									title: 'Успешно',
									description: `Аудит редактирования сообщений выключен. Включить — /лог мсг эдит вкл`,
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
		}
	}

}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "лог",
	aliases: ["kjuxfn"],
	permissions: ["tester"],
	modules: ["tech"]
}