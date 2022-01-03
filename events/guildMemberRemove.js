module.exports = async (client, member) => {
	let guilddb = await client.db.getGuild(member.guild.id)
	let guild = await client.guilds.fetch(member.guild.id)
    if(guilddb.farewellChannel == '') return;
	const channel = await guild.channels.fetch(guilddb.farewellChannel);
	try {
		channel.send({ content: `<@${member.id}>, ${guilddb.farewellText}` });
	} catch (error) {
		return;
	}
};