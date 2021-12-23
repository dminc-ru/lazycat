let fs = require("fs");
module.exports = async (client, message, channel) => {
	let messages = require(`${client.config.jsonPath}messages.json`);
	let guilddb = await client.db.getGuild(message.guild.id)
    if (message.author.id == client.user.id)
		return;
	if (!messages[message.guild.id]) {
        messages[message.guild.id] = [];
    }
	fs.writeFileSync(`${client.config.jsonPath}messages.json`, JSON.stringify(messages, null, "\t"));
	let messageExists = messages[message.guild.id].findIndex(x => x.msgid === message.id);
	if (messageExists != -1) {
		messages[message.guild.id].splice(messageExists, 1);
		fs.writeFileSync(`${client.config.jsonPath}messages.json`, JSON.stringify(messages, null, "\t"));
	}
	if (guilddb.logmsg_channel == "")
		return;
	if (guilddb.logmsg_enable == 'false')
		return;
	if (guilddb.logmsg_type_delete == 'false')
		return;
	if (message.length > 500)
		return;
	let embed = new MessageEmbed()
		.setColor("b88fff")
		.setTitle("Сообщение удалено")
		.addField(`Сообщение:`, `${message.content}`, false)
		.addField(`Канал:`, `${message.channel.name}`, true)
		.addField(`Автор:`, `${message.author.tag}`, true)
		.setTimestamp()
		.setFooter(`Lazy Cat`, client.user.displayAvatarURL({dynamic: true}));
	let logChan = await message.guild.channels.fetch(guilddb.logmsg_channel);
	logChan.send(embed);
}