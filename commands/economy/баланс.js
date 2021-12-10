module.exports.run = async (client, interaction) => {
	try{
		let user = client.users.cache.get(interaction.member.user.id);
		let userdb = await client.db.get(interaction.member.user.id, 'users')
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Баланс',
							author: {
								name: `${user.tag}`,
								icon_url: `${user.displayAvatarURL()}`
							},
							fields: [
								{
									name: 'Рыбки:',
									value: `${userdb.balance_fish} <:lz_fish:742459590087803010>`,
									inline: true
								},
								{
									name: 'Жучки:',
									value: `${userdb.balance_bugs} <:lz_bug:742039591929905223>`,
									inline: true
								},
								{
									name: 'В банке:',
									value: `${userdb.balance_bank} <:lz_fish:742459590087803010>`,
									inline: false
								}
							],
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
	name: "баланс",
	aliases: [",fkfyc"],
	permissions: ["member"],
	modules: ["economy"]
}