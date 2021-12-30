module.exports = async (client, member) => {
	let guilddb = await client.db.getGuild(member.guild.id)
    if(guilddb.welcomeChannel != ''){
		const channel = await member.guild.channels.fetch(guilddb.welcomeChannel);
		channel.send(`<@${member.id}> ${guilddb.welcomeText}`);
	}
	if(guilddb.giveRole != 'false'){
		const role = member.guild.roles.cache.find(role => role.id === guilddb.welcomeRole);
		let reason = `Выдача приветственной роли (/стартроль)`
		try{
			member.roles.add(role, reason);
		} catch(error) {
			return;
		}
	}
};