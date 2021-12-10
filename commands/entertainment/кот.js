const fetch = require('node-superfetch');
module.exports.run = async (client, interaction) => {
        try {
			let user = client.users.cache.get(interaction.member.user.id);
			fetch("https://aws.random.cat/meow")
			.then(res => res.json()).then((data) => {
				if(!data) return msg.edit(errEmbed);
					let catURL = data.file
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
										url: catURL,
									},
								}
							]
						}
					}
				});
				              
			})
		}catch(error){
			client.logger.log(`${error}`, "err");
		}
}

module.exports.help = {
	name: "кот",
	aliases: ["rjn"],
	permissions: ["member"],
	modules: ["entertainment"]
}