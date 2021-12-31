const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		try {
			var guild = await client.guilds.fetch(interaction.guildId)
			var user = await client.users.fetch(interaction.member.user.id)
			var member = await guild.members.fetch(interaction.member.user.id)
			var channel = await client.channels.fetch(interaction.channelId)
		} catch(error) {
			return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
		}
		let toClear = interaction.options.getInteger('количество');
		if (interaction.options.getUser('участник').length > 1) {
			var memberClear = interaction.options.getUser('участник');
		}
		if( !member.permissions.has('MANAGE_MESSAGES') ) {
			return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
		}
		if (!memberClear) {
			if (toClear < 1) {
				return interaction.reply({content: `Укажите корректное количество удаляемых сообщений.`, ephemeral: true})
			}
			if(toClear > 100){
				return interaction.reply({content: `Вы можете удалить только 100 сообщений за одно использование команды.`, ephemeral: true})
			}
			channel.messages.fetch({limit: toClear}).then((messages) =>{
				var botMessages = [];
				messages.forEach(msg => botMessages.push(msg));
				if (botMessages.length < 1) {
					return interaction.reply({content: `Сообщений не обнаружено.`, ephemeral: true})
				}
				channel.bulkDelete(botMessages, true).then((_message) => {
					let deletedEmbed = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle('Успешно')
						.setDescription(`Удалено ${_message.size} сообщений.`)
						.setTimestamp()
						.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
					return interaction.reply({embeds: [deletedEmbed]})
				});
			});
		} else {
			channel.messages.fetch({limit: toClear}).then((messages) =>{
				var botMessages = [];
				messages.filter(m => m.author.id === memberClear).forEach(msg => botMessages.push(msg));
				if (botMessages.length < 1) {
					return interaction.reply({content: `Сообщений не обнаружено.`, ephemeral: true})
				}
				channel.bulkDelete(botMessages, true).then((_message) => {
					let deletedEmbed = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle('Успешно')
						.setDescription(`Удалено ${_message.size} сообщений.`)
						.setTimestamp()
						.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
					return interaction.reply({embeds: [deletedEmbed]})
				});
			});
		}
	} catch(error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "удалить",
	permissions: ["tester"],
	type: "interaction"
}