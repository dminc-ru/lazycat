module.exports = class Command {
	constructor(client, {
		name = null,
		permissions = new Array(),
		type = null,
        enabled = true,
        guildOnly = false
	})
	{
		this.data = { name, permissions, type, enabled, guildOnly };
	}
};