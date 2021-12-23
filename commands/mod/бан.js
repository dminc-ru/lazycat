const { MessageEmbed } = require("discord.js");
const fs = require("fs");
let bans = require(`${client.config.jsonPath}bans.json`);
module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let guild = await client.guilds.fetch(interaction.guild_id);
	let guilddb = await client.db.getGuild(interaction.guild_id)
	let member = await guild.members.fetch(interaction.member.user.id);
	if (!member.hasPermission('BAN_MEMBERS')) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	var banUser = interaction.data.options[0].value;
	var banUserResolve = guild.members.fetch(banUser);
	if (!banUserResolve) {
		return interaction.reply({content: `Пользователь не найден.`, ephemeral: true})
	}
	const memberPosition = banUserResolve.roles.highest.position;
	const moderationPosition = member.roles.highest.position;
	if (guild.owner.user.id != banUser && moderationPosition < memberPosition) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	if (!banUserResolve.bannable) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	if (banUser == interaction.member.user.id) {
		return interaction.reply({content: `Вы не можете забанить себя.`, ephemeral: true})
	}
	const banned = await guild.fetchBans();
		if (banned.some((m) => m.user.id === banUser)) {
			return interaction.reply({content: `Пользователь уже забанен.`, ephemeral: true})
		}
	if (interaction.data.options.length > 1) {
		var reason = interaction.data.options[1].value
	} else {
		var reason = `не указана`
	}
	if (reason.length > 500) {
		return interaction.reply({content: `Максимальное количество символов для причины — 500.`, ephemeral: true})
	}
	let usernames = banUserResolve.tag;
	if (banUser == client.user.id) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения данного действия.`, ephemeral: true})
	}
	try {
		banUserResolve.ban(reason);
	} catch (error) {
		return interaction.reply({content: `Произошла ошибка при попытке бана. Возможно, у меня недостаточно прав для выполнения этого действия.`})
	}
	if (!bans[interaction.guild_id]) {
		bans[interaction.guild_id] = [];
	}
	bans[interaction.guild_id].push({
		discordserverid: interaction.guild_id,
		moderatorid: interaction.member.user.id,
		moderatortag: user.tag,
		memberid: banUser,
		membertag: banUserResolve.tag,
		reason: reason,
		banCreatedAt: Date.now()
	});
	fs.writeFileSync(`${client.config.jsonPath}bans.json`, JSON.stringify(bans, null, "\t"));
	let banMessage = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Бан: успешно')
		.addField(`Модератор:`, user.tag, true)
		.addField(`Пользователь:`, banUserResolve.tag, true)
		.addField(`Причина:`, reason, false)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	interaction.reply({embeds: [banMessage]})
	if(guilddb.logmsg_channel != ""){
		try{
			let banMessage = new MessageEmbed()
				.setColor("#b88fff")
				.setTitle(`Бан: успешно`)
				.addField(`Модератор:`, `${user.tag}`, true)
				.addField(`Пользователь:`, `${banUserResolve.tag}`, true)
				.addField(`Причина:`, `${reason}`, false)
				.setTimestamp()
				.setFooter(`${user.tag}`, user.avatarURL())
			const channel = guild.channels.fetch(guilddb.logmsg_channel);
			channel.send(banMessage);
		}catch(error){
			client.db.changeGuild(interaction.guild_id, 'logmsg_channel', '')
		}
	}
}

module.exports.data = {
	name: "бан",
	permissions: ["member"],
	type: "interaction"
}