module.exports = class Command {
	constructor(client, {
		name = null,
		permissions = new Array(),
		type = null
	})
	{
		this.data = { name, permissions, type };
	}
};