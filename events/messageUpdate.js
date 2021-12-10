module.exports = async (client, oldMessage, newMessage) => {
	let guilddb = await client.db.get(oldMessage.guild.id, 'guilds')
    if(oldMessage.author.id == client.user.id)
		return;
	if(guilddb.logmsg_channel == "")
		return;
	if(guilddb.logmsg_enable == 'false')
		return;
	if(guilddb.logmsg_type_edit == 'false')
		return;
	if(oldMessage.length > 500)
		return;
	if(newMessage.length > 500)
		return;
	let embed = new MessageEmbed()
		.setColor("b88fff")
		.setTitle("Сообщение отредактировано")
		.addField(`Старое сообщение:`, `${oldMessage.content}`, false)
		.addField(`Новое сообщение:`, `${newMessage.content}`, false)
		.addField(`Канал:`, `${oldMessage.channel.name}`, true)
		.addField(`Автор:`, `${oldMessage.author.tag}`, true)
		.setTimestamp()
		.setFooter(`Lazy Cat`, client.user.avatarURL());
	let logChan = oldMessage.guild.channels.cache.get(guilddb.logmsg_channel);
	logChan.send(embed);
};