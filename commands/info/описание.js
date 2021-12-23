const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	const descript = interaction.data.options[0].value;
	if(descript.length > 150)
		return interaction.reply({content: "Максимальное количество символов в описании — 150.", ephemeral: true})
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
	if(occurrence(descript, "\n") > 5)
		return interaction.reply({content: "Максимальное количество переносов в описании — 5.", ephemeral: true})
	client.db.changeUser(interaction.member.user.id, 'description', descript)
	let successEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle('Успешно')
		.setDescription('Описание изменено.')
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	return interaction.reply({embeds: [successEmbed]})
}

module.exports.data = {
	name: "описание",
	permissions: ["member"],
	type: "interaction"
}