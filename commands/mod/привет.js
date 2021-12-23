const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	let guild = await client.guilds.fetch(interaction.guildId);
	let guilddb = await client.db.getGuild(interaction.guildId);
	let user = await client.users.fetch(interaction.member.user.id);
	let member = await guild.members.fetch(interaction.member.user.id);
	var whattoDo = interaction.data.options[0].name;
	if( !member.hasPermission('ADMINISTRATOR') ) {
		return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
	}
	if(whattoDo == "чат"){
		let newChannel = interaction.data.options[0].options[0].value;
		client.db.changeGuild(interaction.guildId, 'welcomeChannel', newChannel)
		let successEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Успешно')
			.setDescription('Канал для приветственных сообщений установлен.')
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [successEmbed]})
	}
	if (whattoDo == "мсг") {
		if (guilddb.welcomeChannel == '') {
			return interaction.reply({content: `Установите текстовый канал для приветственных сообщений: /привет чат <#канал>`, ephemeral: true})
		}
		client.db.changeGuild(interaction.guildId, 'welcomeText', interaction.data.options[0].options[0].value)
		let successEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Успешно')
			.setDescription('Текст приветственных сообщений установлен.')
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [successEmbed]})
	}
}

module.exports.data = {
	name: "привет",
	permissions: ["member"],
	type: "interaction"
}