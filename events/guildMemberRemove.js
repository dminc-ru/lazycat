module.exports = async (client, member) => {
	let guilddb = client.db.getGuild(member.guild.id)
    if(guilddb.goodbyeChannel == '') return;
	const channel = await member.guild.channels.fetch(guilddb.goodbyeChannel);
	try {
		channel.send(`<@${member.id}>, ${guilddb.goodbyeText}`);
	} catch (error) {
		return;
	}
};