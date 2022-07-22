module.exports = async (client, member) => {
	let guilddb = await client.db.getGuild(member.guild.id)
	let guild = await client.guilds.fetch(member.guild.id)
    if(guilddb.welcomeChannel != ''){
		const channel = guild.channels.cache.get(guilddb.welcomeChannel) || await guild.channels.fetch(guilddb.welcomeChannel);
		channel.send({ content: `<@${member.id}> ${guilddb.welcomeText}` });
	}
	if(guilddb.giveRole != 'false'){
		const role = guild.roles.cache.find(role => role.id === guilddb.welcomeRole) || await guild.roles.fetch(guilddb.welcomeRole);
		try{
			member.roles.add(role, client.messages.giveRoleReason);
		} catch(error) {
			return;
		}
	}
};