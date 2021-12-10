module.exports.run = async (client, interaction) => {
try{
	let user = client.users.cache.get(interaction.member.user.id);
	let guild = client.guilds.cache.get(interaction.guild_id);
	let member = guild.members.cache.get(interaction.member.user.id);
	if(!member.hasPermission('ADMINISTRATOR'))
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `У вас недостаточно прав для выполнения этой команды.`
				}
			}
		});
	client.db.change(interaction.guild_id, 'guilds', 'muteRole', interaction.data.options[0].value)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: 'Успешно',
						description: `Роль для мута установлена.`,
						timestamp: new Date(),
						footer: {
							text: `${user.tag}`,
							icon_url: `${user.displayAvatarURL()}`,
						}
					}
				]
			}
		}
	});
}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "мутроль",
	aliases: ["venhjkm"],
	permissions: ["member"],
	modules: ["tech"]
}