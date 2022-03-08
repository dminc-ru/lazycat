const corona = require('novelcovid');
module.exports.run = async (client, interaction) => {
	try {
		let noUser = client.utils.error('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return message.channel.send({embeds: [noUser]})
		}
		corona.all().then(coronavirus => {
			let coronaEmbed = client.utils.embed('COVID-19: мир', `${client.emoji.covid} Общая статистика коронавируса`, user)
				.addField(`Всего заразилось:`, coronavirus.cases.toLocaleString(), true)
				.addField(`Всего умерло:`, coronavirus.deaths.toLocaleString(), true)
				.addField(`Всего выздоровело:`, coronavirus.recovered.toLocaleString(), true)
				.addField('Сегодня заразилось:', coronavirus.todayCases.toLocaleString(), true)
				.addField('Сегодня умерло:', coronavirus.todayDeaths.toLocaleString(), true)
			interaction.reply({embeds: [coronaEmbed]})
		});
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "корона",
	permissions: ["member"],
	type: "interaction"
}