const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
module.exports.run = async (client, interaction) => {
	let mutes = require(`${client.config.jsonPath}mutes.json`);
	if(!mutes[interaction.guild_id])
		mutes[interaction.guild_id] = [];
	let user = await client.users.fetch(interaction.member.user.id);
	let guild = await client.guilds.fetch(interaction.guild_id);
	let guilddb = await client.db.getGuild(interaction.guild_id)
	let member = await guild.members.fetch(interaction.member.user.id);
	if ( !member.hasPermission('MANAGE_MESSAGES') ) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	if (guilddb.muteRole == '') {
		return interaction.reply({content: `На этом сервере не установлена роль для мута. Обратитесь к администратору сервера.`, ephemeral: true})
	}
	var muteUser = interaction.data.options[0].value;
	var muteUserClientResolve = await client.users.fetch(interaction.data.options[0].value)
	var muteUserResolve = await guild.members.fetch(muteUser);
	let usernames = muteUserClientResolve.tag;
	if (muteUserResolve) {
		const memberPosition = muteUserResolve.roles.highest.position;
		const moderationPosition = member.roles.highest.position;
		if( !(moderationPosition > memberPosition) ) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
		}
	} else {
		return interaction.reply({content: `Пользователь не найден.`, ephemeral: true})
	}
	if (muteUser == interaction.member.user.id) {
		return interaction.reply({content: `Вы не можете замутить себя.`, ephemeral: true})
	}
	if (muteUser == client.user.id) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	if (interaction.data.options.length > 2) {
		var reason = interaction.data.options[2].value
	} else {
		var reason = `не указана`;
	}
	const role = guilddb.muteRole;
    const mutetime = ms(interaction.data.options[1].value);
	if (mutetime < 60000) {
		return interaction.reply({content: `Минимальное время мута — 1 минута.`, ephemeral: true})
	}
	if (mutetime > 1209600000) {
		return interaction.reply({content: `Максимальное время мута — 14 дней.`, ephemeral: true})
	}
    if (typeof mutetime === 'undefined') {
		return interaction.reply({content: `Неправильный формат времени.`, ephemeral: true})
	}
	if ( mutes[interaction.guild_id].find(us => us.memberid == muteUser) ) {
		return interaction.reply({content: `Пользователь уже замьючен.`, ephemeral: true})
	}
	try {
		muteUserResolve.roles.add(role, {reason});
	} catch (error) {
		return interaction.reply({content: `Произошла ошибка при попытке мута. Возможно, у меня недостаточно прав для выполнения этого действия.`, ephemeral: true})
	 }
	mutes[interaction.guild_id].push({
		discordserverid: interaction.guild_id,
		moderatorid: interaction.member.user.id,
		moderatortag: user.tag,
		memberid: muteUser,
		membertag: muteUserClientResolve.tag,
		reason: reason,
		roleid: role.id,
		muteCreatedAt: Date.now(),
		muteEndDate: Date.now() + mutetime
	});
	fs.writeFileSync(`${client.config.jsonPath}mutes.json`, JSON.stringify(mutes, null, "\t"));
	let muteSuccess = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Мут: успешно')
		.addField('Модератор', user.tag, true)
		.addField('Пользователь', usernames, true)
		.addField('Длительность', ms(mutetime, { long: true }))
		.addField('Причина:', reason, false)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	interaction.reply({embeds: [muteSuccess]})
	if(guilddb.logmsg_channel != ""){
		try{
			let muteMessage = new MessageEmbed()
				.setColor(`#b88fff`)
				.setTitle("Мут: успешно")
				.addField('Модератор:', `${user.tag}`, true)
				.addField('Пользователь:', `${muteUserClientResolve.tag}`, true)
				.addField('Длительность:', `${ms(mutetime, {long: true})}`, false)
				.addField('Причина:', `${reason}`, false)
				.setTimestamp()
				.setFooter(`${user.tag}`, user.displayAvatarURL({dynamic: true}));
			const channel = await guild.channels.fetch(guilddb.logmsg_channel);
			channel.send(muteMessage);
		}catch(error){
			client.db.changeGuild(interaction.guild_id, 'logmsg_channel', '')
		}
	}
}

module.exports.data = {
	name: "мут",
	permissions: ["member"],
	type: "interaction"
}