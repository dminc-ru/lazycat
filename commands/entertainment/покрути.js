module.exports.run = async (client, interaction) => {
try{
	let user = client.users.cache.get(interaction.member.user.id);
	let userdb = await client.db.get(interaction.member.user.id, 'users')
	let money = interaction.data.options[0].value;
	money = Number(interaction.data.options[0].value);
	if(money < 1){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Укажите корректное количество жучков.`
				}
			}
		});
	}
	if(money > userdb.balance_bugs){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `У вас недостаточно жучков.`
				}
			}
		});
	}
	function random(min, max) {
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}
	client.db.change(interaction.member.user.id, 'users', 'balance_bugs', (userdb.balance_bugs - money))
	let roulette = [":coconut:", ":banana:", ":watermelon:", ":green_apple:", ":strawberry:", ":cherries:"];
	let first = random(0, 5);
	let second = random(0, 5);
	let third = random(0, 5);
	if(first == second && second == third){
		userdb = await client.db.get(interaction.member.user.id, 'users')
		userdb = userdb[0]
		let toDeposit = money * 2;
		client.db.change(interaction.member.user.id, 'users', 'balance_bugs', (userdb.balance_bugs + toDeposit))
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: 'Коробка',
							description: `${roulette[first]} | ${roulette[second]} | ${roulette[third]}\n\n**Вы выиграли ${toDeposit}** <:lz_bug:742039591929905223>`,
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
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: 'Коробка',
						description: `${roulette[first]} | ${roulette[second]} | ${roulette[third]}\n\nВы проиграли ${money} <:lz_bug:742039591929905223>`,
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
	name: "покрути",
	aliases: ["gjrhenb"],
	permissions: ["tester"],
	modules: ["entertainment"]
}