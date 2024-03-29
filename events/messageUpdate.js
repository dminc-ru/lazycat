const { MessageEmbed } = require('discord.js')
module.exports = async (client, oldMessage, newMessage) => {
	let guilddb = await client.db.getGuild(oldMessage.guild.id)
    if (oldMessage.author.id == client.user.id)
		return;
	if (guilddb.logmsg_channel == "")
		return;
	if (guilddb.logmsg_enable == 'false')
		return;
	if (guilddb.logmsg_type_edit == 'false')
		return;
	if (oldMessage.length > 500)
		return;
	if (newMessage.length > 500)
		return;
	let embed = new MessageEmbed()
		.setColor("b88fff")
		.setTitle("Сообщение отредактировано")
		.addField(`Старое сообщение:`, `\`\`\`${oldMessage.content}\`\`\``, false)
		.addField(`Новое сообщение:`, `\`\`\`${newMessage.content}\`\`\``, false)
		.addField(`Канал:`, `<#${oldMessage.channel.id}>`, true)
		.addField(`Автор:`, `<@${oldMessage.author.id}>`, true)
		.setTimestamp()
		.setFooter({ text: `Lazy Cat`, iconURL: client.user.displayAvatarURL({dynamic: true}) });
	let logChan = await oldMessage.guild.channels.fetch(guilddb.logmsg_channel);
	logChan.send({ embeds: [embed] });
};