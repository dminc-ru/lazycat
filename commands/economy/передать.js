module.exports.run = async (client, interaction) => {
try{
	let user = client.users.cache.get(interaction.member.user.id);
	let userdb = await client.db.get(interaction.member.user.id, 'users')
	let memberdb = await client.db.get(interaction.data.options[0].value, 'users');
	var money = interaction.data.options[1].value;
	money = Number(interaction.data.options[1].value);
	if(interaction.member.user.id == interaction.data.options[0].value){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Вы не можете передать рыбки самому себе.`
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
	if(money > 10000){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Вы можете перевести максимум 10000 <:lz_fish:742459590087803010> за одну транзакцию.`
				}
			}
		});
	}
	if(money == 0){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Укажите корректное количество рыбок.`
				}
			}
		});
	}
	if(money < 0){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Укажите корректное количество рыбок.`
				}
			}
		});
	}
	if(userdb.balance_fish < money){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `У вас недостаточно средств.`
				}
			}
		});
	}
	let receive = await client.db.get(interaction.data.options[0].value, 'users')
	if(!receive){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Указанный пользователь не найден в системе Lazy Cat.`
				}
			}
		});
	}
	client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish - money))
	client.db.change(interaction.data.options[0].value, 'users', 'balance_fish', (memberdb.balance_fish + money))
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: 'Транзакция',
						description: `Успешно! Переведено ${money} <:lz_fish:742459590087803010>.`,
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
	name: "передать",
	aliases: ["перевести", "gthtlfnm", "gthtdtcnb"],
	permissions: ["member"],
	modules: ["economy"]
}