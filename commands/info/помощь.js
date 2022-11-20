const Command = require('../../class/Command')
class Help extends Command {
	constructor(client) {
		super(client, {
			name: 'помощь',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: false
		})
	}

	async run (client, interaction) {
		try {
			let noUser = client.utils.error('Пользователь не найден в базе данных.')
			try {
				var user = await client.users.fetch(interaction.member.user.id);
			} catch (error) {
				return message.channel.send({embeds: [noUser]})
			}
			let pegg = client.utils.randInt(1, 250);
			if(pegg == 55) {
				let eggEmbed = client.utils.embed('Команды Lazy Cat:')
					.setImage('https://thumbs.gfycat.com/SoftFlimsyBufeo-size_restricted.gif')
					.setFooter({ text: `${user.tag} • Команды: /помощь`, iconURL: user.displayAvatarURL({dynamic: true}) })
				interaction.reply({embeds: [eggEmbed]})
			}
			let prefix = '/';
			let helpEmbed = client.utils.embed('Команды Lazy Cat:', 
					`[Официальная документация](https://lazycat.dminc.ru)
					[**Добавить на свой сервер**](${client.config.inviteLink})`, user)
				.addField('Радио:', `\`${prefix}громкость\` \`${prefix}назад\` \`${prefix}плей\` \`${prefix}пауза\` \`${prefix}скип\` \`${prefix}стоп\` \`${prefix}повтор\` \`${prefix}сейчас\` \`${prefix}очередь\` \`${prefix}очистить\``, false)
				.addField('Информация:', `\`${prefix}помощь\``, false)
				.addField('Развлекательные:', `Теперь в [Smiley](https://dminc.ru/world)`, false)
				.addField('Кейсы:', `Теперь в [Smiley](https://dminc.ru/world)`, false)
				.addField('Экономика:', `Теперь в [Smiley](https://dminc.ru/world)`, false)
				.addField('Модерация:', `Теперь в [Guard](https://dminc.ru/world)`, false)
				
			interaction.reply({embeds: [helpEmbed]})
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Help;