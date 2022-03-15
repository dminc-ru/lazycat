const Command = require('../../class/Command')
class Goodbye extends Command {
	constructor(client) {
		super(client, {
			name: 'пока',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: true
		})
	}

	async run (client, interaction) {
		try {
			try {
				var guild = await client.guilds.fetch(interaction.guildId)
				var user = await client.users.fetch(interaction.member.user.id)
				var member = await guild.members.fetch(interaction.member.user.id)
			} catch(error) {
				return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
			}
			let guilddb = await client.db.getGuild(interaction.guildId)
			var whattoDo = interaction.options.getSubcommand();
			if( !member.permissions.has('ADMINISTRATOR') ) {
				return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
			}
			if(whattoDo == "чат"){
				let newChannel = interaction.options.getChannel('канал');
				client.db.changeGuild(interaction.guildId, 'farewellChannel', newChannel.id)
				let successEmbed = client.utils.success(`Канал для оповещений о покинувших сервер участниках установлен.`, user)
				return interaction.reply({embeds: [successEmbed]})
			}
			if(whattoDo == "мсг"){
				if (guilddb.farewellChannel == '') {
					return interaction.reply({content: `Установите текстовый канал для оповещений: /пока чат <#канал>`, ephemeral: true})
				}
				client.db.changeGuild(interaction.guildId, 'farewellText', interaction.options.getString('текст'))
				let successEmbed = client.utils.success('Текст оповещения о покинувших сервер участниках установлен.', user)
				return interaction.reply({embeds: [successEmbed]})
			}
		} catch(error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Goodbye;