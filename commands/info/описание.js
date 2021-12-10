module.exports.run = async (client, interaction) => {
try{
	let user = client.users.cache.get(interaction.member.user.id);
	const descript = interaction.data.options[0].value;
	if(descript.length > 150){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Максимальное количество символов в описании — 150.`
				}
			}
		}); 
	}
	function occurrence(string, substring) {
		var counter = 0;
		var sub = substring.toLowerCase();
		var str = string.toLowerCase(); 
		var array = [];
		var index = -1;

		do {
			index = str.indexOf(sub, index + 1);
			if (index != -1) {
				array[counter++] = index;
				i = index;
			}
		} while (index != -1);

		return counter;
	}
	if(occurrence(descript, "\n") > 5){
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: `Максимальное количество переносов в описании — 5`
				}
			}
		});
	}
	client.db.change(interaction.member.user.id, 'users', 'description', descript)
	return client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: 'Успешно',
						description: `Описание изменено.`,
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
	name: "описание",
	aliases: ["jgbcfybt"],
	permissions: ["member"],
	modules: ["info"]
}