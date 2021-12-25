const { MessageEmbed } = require("discord.js");
let fs = require('fs');
module.exports.run = async (client, interaction) => {
	try {
		let mutes = require(`${client.config.jsonPath}mutes.json`)
		if(!mutes[interaction.guildId])
			mutes[interaction.guildId] = [];
		try {
			var user = await client.users.fetch(interaction.member.user.id)
			var guild = await client.guilds.fetch(interaction.guildId)
			var member = await guild.members.fetch(interaction.member.user.id)
			var unMuteUser = interaction.options.getUser('участник')
			var unMuteUserResolve = await guild.members.fetch(unMuteUser)
		} catch(error) {
			return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
		}
		let guilddb = await client.db.getGuild(interaction.guildId)
		if( !member.hasPermission('MANAGE_MESSAGES') ) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения этого действия.`, ephemeral: true})
		}
		if (guilddb.muteRole == '') {
			return interaction.reply({content: `На этом сервере не установлена роль для мута. Обратитесь к администратору сервера.`, ephemeral: true})
		}
		if (!unMuteUserResolve) {
			return interaction.reply({content: `Пользователь не найден.`, ephemeral: true})
		}
		if (unMuteUser == interaction.member.user.id) {
			return interaction.reply({content: `Вы не можете размутить себя.`, ephemeral: true})
		}
		let checkMute = mutes[interaction.guildId].find(obj => obj.memberid == unMuteUser);
		if ( !unMuteUserResolve.roles.cache.has(guilddb.muteRole) || !checkMute) {
			return interaction.reply({content: `Пользователь не замьючен.`, ephemeral: true})
		}
		if (interaction.data.options.length > 1) {
			var reason = interaction.options.getString('причина')
		} else {
			var reason = `не указана`;
		}
		const role = guilddb.muteRole;
		try {
			unMuteUserResolve.roles.remove(role);
		} catch (error) {
			console.log(error);
			return interaction.reply({content: `Произошла ошибка при попытке убрать роль. Возможно, у меня недостаточно прав для этого действия.`, ephemeral: true})
		}
		var getMute = mutes[interaction.guildId].find(mute => mute.memberid == unMuteUser);
		let unmuteSuccess = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Размут: успешно')
			.addField('Модератор:', getMute.moderatortag, true)
			.addField('Пользователь:', getMute.membertag, true)
			.addField('Причина:', getMute.reason, false)
			.addField('Размутил:', user.tag, true)
			.addField('Причина размута:', reason, true)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		interaction.reply({embeds: [unmuteSuccess]})
		var getMute = mutes[interaction.guildId].find(mute => mute.memberid == unMuteUser);
		mutes[interaction.guildId].splice(checkMute, 1);
		fs.writeFileSync(`${client.config.jsonPath}mutes.json`, JSON.stringify(mutes, null, "\t"));
		let muteMessage = new MessageEmbed()
			.setColor(`#b88fff`)
			.setTitle("Размут: успешно")
			.addField(`Модератор:`, `${getMute.moderatortag}`, true)
			.addField('Пользователь:', `${getMute.membertag}`, true)
			.addField('Причина мута:', `${getMute.reason}`, false)
			.addField(`Размутил:`, `${user.tag}`, true)
			.addField(`Причина размута:`, `${reason}`, true)
			.setTimestamp()
			.setFooter(`Lazy Cat`, client.user.displayAvatarURL({dynamic: true}));
		if(guilddb.logmsg_channel != ""){
			try {
				const channel = await guild.channels.fetch(guilddb.logmsg_channel);
				channel.send(muteMessage);
			} catch(error) {
				return
			}
		}
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
	}
}

module.exports.data = {
	name: "размут",
	permissions: ["member"],
	type: "interaction"
}