const corona = require('novelcovid');
module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	corona.all().then(coronavirus => {
		let coronaEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('COVID-19: мир')
			.setDescription(`${client.emoji.covid} Общая статистика коронавируса`)
			.addField(`Всего заразилось:`, coronavirus.cases.toLocaleString(), true)
			.addField(`Всего умерло:`, coronavirus.deaths.toLocaleString(), true)
			.addField(`Всего выздоровело:`, coronavirus.recovered.toLocaleString(), true)
			.addField('Сегодня заразилось:', coronavirus.todayCases.toLocaleString(), true)
			.addField('Сегодня умерло:', coronavirus.todayDeaths.toLocaleString(), true)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		interaction.reply({embeds: [coronaEmbed]})
	});
}

module.exports.data = {
	name: "корона",
	permissions: ["member"],
	type: "interaction"
}