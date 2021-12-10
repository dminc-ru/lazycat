module.exports = async (client, member) => {
	let guilddb = client.db.get(member.guild.id, 'guilds')
    if(guilddb.goodbyeChannel == '') return;
	const channel = member.guild.channels.cache.get(guilddb.goodbyeChannel);
	try {
		channel.send(`<@${member.id}>, ${guilddb.goodbyeText}`);
	} catch (error) {
		return;
	}
};