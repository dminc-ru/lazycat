module.exports.run = async (client, interaction) => {
try{
	let user = client.users.cache.get(interaction.member.user.id);
	let member = interaction.data.options[0].value;
	function randomSteal(min, max) {
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}
	let memberdb = await client.db.get(interaction.member.user.id, 'users')
	let userdb = await client.db.get(interaction.member.user.id, 'users')
	if(member == interaction.member.user.id){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Вы не можете своровать рыбки у самого себя.`
				}
			}
		});
	}
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
	if(memberdb.balance_fish < 50){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Этот пользователь не имеет так много рыбок, чтобы его можно было обокрасть.`
				}
			}
		});
	}
	if(member == 707539807957680129){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Внимательный котик вас заметил, а вы его нет. Кажется, это бесполезно.`
				}
			}
		});
	}
	let tryin = randomSteal(1, 100)
	if(tryin < 30){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Воровство: неудача',
							description: `<:lz_fish:742459590087803010> Неудача! Вас заметили, и вы пытаетесь скрыться.`,
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
	else{
		let stFish = randomSteal(1, 5)
		client.db.change(memberdb.discord_id, 'users', 'balance_fish', (memberdb.balance_fish - stFish))
		client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + stFish))
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Воровство: успешно',
							description: `<:lz_fish:742459590087803010> Шалость удалась! Вам зачислено ${stFish} <:lz_fish:742459590087803010>.`,
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
	};
}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "своровать",
	aliases: ["cdjhjdfnm", "украсть", "erhfcnm"],
	permissions: ["member"],
	modules: ["entertainment"]
}