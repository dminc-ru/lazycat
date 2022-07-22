module.exports = class Command {
	constructor(client, {
		name = null,
		permissions = null,
		type = null,
        enabled = true,
        guildOnly = false
	})
	{
		this.data = { name, permissions, type, enabled, guildOnly };
	}
};