module.exports = async (client, interaction) => {
    if (!interaction.guildId)
		return interaction.reply({ content: "На данный момент команды можно использовать только на сервере.", ephemeral: true });
	var user = await client.db.getUser(interaction.member.user.id);
	let fetchedUser = await client.users.fetch(interaction.member.user.id)
	if(!user){
		await client.db.addUser(interaction.member.user.id);
		user = await client.db.getUser(interaction.member.user.id);
	}
	if(!user){
		client.logger.log(`Ошибка получения данных. User ID: ${interaction.member.user.id}`, 'err');
		return interaction.reply({ content: `Произошла ошибка. Попробуйте ещё раз или обратитесь на наш сервер поддержки.\nКод ошибки: LZE-179`, ephemeral: true})
	}
	if (user.banned == true) return;
	var guild = await client.db.getGuild(interaction.guildId);
	if(!guild){
		await client.db.addGuild(interaction.guildId)
		guild = await client.db.getGuild(interaction.guildId);
	}
	let commandfile = client.commands.get(interaction.commandName);
	if(commandfile) {
		switch (commandfile.permissions) {
			case 'member': {
				if(user.permissions_member != true)
					return;
				break;
			}
			case 'tester': {
				if(user.permissions_tester != true)
					return;
				break;
			}
			case 'lia': {
				if(user.permissions_lia != true)
					return;
				break;
			}
			case 'developer': {
				if(user.permissions_developer != true)
					return;
				break;
			}
			default: break;
		}

		stats.commands += 1;
        client.saveJSON(stats);
		if(commandfile){
			client.logger.log(`INTERACTION ${interaction.id} || ${fetchedUser.tag} || ${interaction.member.user.id} || ${interaction.commandName}`, 'cmd')
			try {
				await commandfile.run(client, interaction);
			} catch (error) {
				await interaction.reply({ content: `Произошла ошибка при выполнении команды. Пожалуйста, сообщите нам через Сервер Поддержки.\nКод ошибки: ${interaction.id}`})
			}
		}else{
			return; 
		};
	}
};