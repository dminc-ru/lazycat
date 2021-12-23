const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	let guild = await client.guilds.fetch(interaction.guildId);
	let guilddb = await client.db.getGuild(interaction.guildId)
	let user = await client.users.fetch(interaction.member.user.id);
	let member = await guild.members.fetch(interaction.member.user.id);
	var whattoDo = interaction.data.options[0].name;
	if( !member.hasPermission('ADMINISTRATOR') ) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	if(whattoDo == "чат"){
		let newChannel = interaction.data.options[0].options[0].value;
		client.db.changeGuild(interaction.guildId, 'farewellChannel', newChannel)
		let successEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Успешно')
			.setDescription(`Канал для оповещений о покинувших сервер участниках установлен.`)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [successEmbed]})
	}
	if(whattoDo == "мсг"){
		if (guilddb.farewellChannel == '') {
			return interaction.reply({content: `Установите текстовый канал для оповещений: /пока чат <#канал>`, ephemeral: true})
		}
		client.db.changeGuild(interaction.guildId, 'farewellText', interaction.data.options[0].options[0].value)
		let successEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Успешно')
			.setDescription('Текст оповещения о покинувших сервер участниках установлен.')
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [successEmbed]})
	}
}

module.exports.data = {
	name: "пока",
	permissions: ["member"],
	type: "interaction"
}