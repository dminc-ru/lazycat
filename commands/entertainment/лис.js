const request = require('node-superfetch');
module.exports.run = async (client, interaction) => {
	try{
		const { body } = await request.get('https://randomfox.ca/floof');
		let user = client.users.cache.get(interaction.member.user.id);
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							timestamp: new Date(),
							footer: {
								text: `${user.tag}`,
								icon_url: `${user.displayAvatarURL()}`,
							},
							image: {
								url: body.image,
							},
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
	name: "лис",
	aliases: ["лиса", "лисы", "kbc", "kbcf", "kbcs"],
	permissions: ["member"],
	modules: ["entertainment"]
}