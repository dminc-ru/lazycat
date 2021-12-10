module.exports.run = async (client, interaction) => {
	try{
		let user = client.users.cache.get(interaction.member.user.id);
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: '<:lz_heart:818202697530474567> Донат',
							description: `Здесь вы можете материально поддержать разработку Lazy Cat. Спасибо!`,
							fields: [
								{
									name: '<:da:818204628843233353> Donation Alerts',
									value: '[клик](https://www.donationalerts.com/r/lazycatru)',
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
	name: "донат",
	aliases: ["ljyfn"],
	permissions: ["member"],
	modules: ["donate"]
}