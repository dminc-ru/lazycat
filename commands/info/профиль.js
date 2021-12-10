let badgebase = require(`${process.env.PATHTOBASE}/badges.json`);
module.exports.run = async (client, interaction) => {
try{
	let userdb = await client.db.get(interaction.member.user.id, 'users')
	var memberProfile
	if(interaction.data.options)
		memberProfile = client.users.cache.get(interaction.data.options[0].value);
	let user = client.users.cache.get(interaction.member.user.id);
	let badgess = [];
	if(!memberProfile) {
			let userbadges = userdb.badges.split(',')
			userbadges.length--
			userbadges.map(badge => {
				let emoji = badgebase.find(badg => badg.codename === badge).emoji;
				let name = badgebase.find(badg => badg.codename === badge).name;
				badgess.push(`${emoji} ${name}`);
			});
			if(badgess == '')
				badgess.push(`-`);
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'Профиль',
								author: {
									name: `${user.tag}`,
									icon_url: `${user.displayAvatarURL()}`,
								},
								description: `**Описание:** ${userdb.description}`,
								fields: [
									{
										name: 'Баланс',
										value: `${userdb.balance_fish} <:lz_fish:742459590087803010>`,
										inline: true
									},
									{
										name: `В банке:`,
										value: `${userdb.balance_bank} <:lz_fish:742459590087803010>`,
										inline: true
									},
									{
										name: 'Жучков:',
										value: `${userdb.balance_bugs} <:lz_bug:742039591929905223>`,
										inline: true
									},
									{
										name: 'Значки:',
										value: `${badgess.join('\n')}`,
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
	}
	else {
		let memberdb = await client.db.get(memberProfile.id, 'users')
		if(!memberdb){
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							flags: 64,
							content: `Указанный пользователь не зарегистрирован в системе Lazy Cat.`
						}
					}
				});
		}
			let memberbadges = memberdb.badges.split(',')
			memberbadges.length--
			memberbadges.map(badge => {
				let emoji = badgebase.find(badg => badg.codename === badge).emoji;
				let name = badgebase.find(badg => badg.codename === badge).name;
				badgess.push(`${emoji} ${name}`);
			});
			if(badgess == '')
				badgess.push(`-`);
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							embeds: [
								{
									color: 0xb88fff,
									title: 'Профиль',
									author: {
										name: `${memberProfile.tag}`,
										icon_url: `${memberProfile.displayAvatarURL()}`,
									},
									description: `**Описание:** ${memberdb.description}`,
									fields: [
										{
											name: 'Баланс',
											value: `${memberdb.balance_fish} <:lz_fish:742459590087803010>`,
											inline: true
										},
										{
											name: `В банке:`,
											value: `${memberdb.balance_bank} <:lz_fish:742459590087803010>`,
											inline: true
										},
										{
											name: 'Жучков:',
											value: `${memberdb.balance_bugs} <:lz_bug:742039591929905223>`,
											inline: true
										},
										{
											name: 'Значки:',
											value: `${badgess.join('\n')}`,
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
	}
}catch(error){
		client.logger.log(`${error}`, "err");
		console.log(error);
	}
}

module.exports.help = {
	name: "профиль",
	aliases: ["ghjabkm"],
	permissions: ["member"],
	modules: ["info"]
}