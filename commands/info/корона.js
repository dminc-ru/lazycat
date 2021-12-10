const corona = require('novelcovid');
module.exports.run = async (client, interaction) => {
	try{
		let user = client.users.cache.get(interaction.member.user.id);
		corona.all().then(coronavirus => {
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								title: 'COVID-19: мир',
								description: `<:lz_covid:781187060542603285> Общая статистика коронавируса`,
								fields: [
									{
										name: 'Всего заразилось:',
										value: `${coronavirus.cases.toLocaleString()}`,
										inline: true
									},
									{
										name: 'Всего умерло:',
										value: `${coronavirus.deaths.toLocaleString()}`,
										inline: true
									},
									{
										name: 'Всего выздоровело:',
										value: `${coronavirus.recovered.toLocaleString()}`,
										inline: true
									},
									{
										name: 'Сегодня заразилось:',
										value: `${coronavirus.todayCases.toLocaleString()}`,
										inline: true
									},
									{
										name: 'Сегодня умерло:',
										value: `${coronavirus.todayDeaths.toLocaleString()}`,
										inline: true
									},
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
		});
	}catch(error){
		client.logger.log(`${error}`, "err");
		}
}

module.exports.help = {
	name: "корона",
	aliases: ["rjhjyfdbhec", "коронавирус", "rjhjyf"],
	permissions: ["member"],
	modules: ["info"]
}