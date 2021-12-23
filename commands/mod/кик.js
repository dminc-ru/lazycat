const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let guild = await client.guilds.fetch(interaction.guildId);
	let guilddb = await client.db.getGuild(interaction.guildId)
	let member = await guild.members.fetch(interaction.member.user.id);
	let toKick = interaction.data.options[0].value;
	let toKickClientResolve = await client.users.fetch(toKick);
	if ( !member.hasPermission('KICK_MEMBERS') ) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	var toKickResolve = await guild.members.fetch(toKick);
	if(toKickResolve){
		const memberPosition = toKickResolve.roles.highest.position;
		const moderationPosition = member.roles.highest.position;
		if ( !(moderationPosition > memberPosition) || !toKickResolve.kickable) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
		}
	} else {
		return interaction.reply({content: `Пользователь не найден.`, ephemeral: true})
	}
	if (toKick == interaction.member.user.id) {
		return interaction.reply({content: `Вы не можете кикнуть себя.`, ephemeral: true})
	}
	if (toKick == client.user.id) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения данного действия.`, ephemeral: true})
	}
    if (interaction.data.options.length > 1) {
		var reason = interaction.data.options[1].value
	} else {
		var reason = `не указана`;
	}
	try{
		guild.members.kick(toKick, {reason});
	} catch(error) {
		console.log(error)
		return interaction.reply({content: `Произошла ошибка при попытке кика. Возможно, у меня недостаточно прав для выполнения этого действия.`, ephemeral: true})
	}
	let usernames = toKickClientResolve.tag;
	let kickMessage = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Кик: успешно')
		.addField('Модератор:', user.tag, true)
		.addField('Пользователь:', usernames, true)
		.addField('Причина:', reason, false)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	interaction.reply({embeds: [kickMessage]})
	if(guilddb.logmsg_channel != ""){
		try {
			const channel = await guild.channels.fetch(guilddb.logmsg_channel);
			let muteMessage = new MessageEmbed()
			.setColor(`#b88fff`)
			.setTitle("Кик: успешно")
			.addField('Модератор:', `${user.tag}`, true)
			.addField('Пользователь:', `${usernames}`, true)
			.addField('Причина:', `${reason}`, false)
			.setTimestamp()
			.setFooter(`${user.tag}`, user.displayAvatarURL({dynamic: true}));
			return channel.send(muteMessage);
		} catch(error) {
			client.db.changeGuild(interaction.guildId, 'logmsg_channel', '');
		}
	}
}

module.exports.data = {
	name: "кик",
	permissions: ["member"],
	type: "interaction"
}