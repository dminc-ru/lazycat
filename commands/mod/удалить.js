module.exports.run = async (client, interaction) => {
try{
	let guild = client.guilds.cache.get(interaction.guild_id);
	let user = client.users.cache.get(interaction.member.user.id);
	let member = guild.members.cache.get(interaction.member.user.id);
	let channel = client.channels.cache.get(interaction.channel_id);
	let toClear = interaction.data.options[0].value;
	if(interaction.data.options.length > 1)
		var memberClear = interaction.data.options[1].value;
	if(!member.hasPermission('MANAGE_MESSAGES'))
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				flags: 64,
				content: `У вас недостаточно прав для выполнения этой команды.`
			}
		}
	});
	if(!memberClear){
		if(toClear < 1){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Укажите корректное количество удаляемых сообщений.`
					}
				}
			});
		}
		if(toClear > 100){
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						flags: 64,
						content: `Вы можете удалить только 100 сообщений за одно использование команды.`
					}
				}
			});
		}
		channel.messages.fetch({limit: toClear}).then((messages) =>{
			var botMessages = [];
			messages.forEach(msg => botMessages.push(msg));
			if(botMessages.length < 1){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Сообщений не обнаружено.`
						}
					}
				});
			}
			channel.bulkDelete(botMessages, true).then((_message) => {
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [
								{
									color: 0xb88fff,
									title: 'Успешно',
									description: `Удалено ${_message.size} сообщений.`,
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
			});
		});
	}else{
		channel.messages.fetch({limit: toClear}).then((messages) =>{
			var botMessages = [];
			messages.filter(m => m.author.id === memberClear).forEach(msg => botMessages.push(msg));
			if(botMessages.length < 1){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Сообщений не обнаружено.`
						}
					}
				});
			}
			channel.bulkDelete(botMessages, true).then((_message) => {
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [
								{
									color: 0xb88fff,
									title: 'Успешно',
									description: `Удалено ${_message.size} сообщений.`,
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
			});
		});
	}

}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "удалить",
	aliases: ["elfkbnm"],
	permissions: ["tester"],
	modules: ["mod"]
}