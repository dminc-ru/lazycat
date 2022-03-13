const request = require('node-superfetch');
const Command = require('../../class/Command')
class Fox extends Command {
	constructor(client) {
		super(client, {
			name: 'лис',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: false
		})
	}

	async run(client, interaction) {
		try {
			const { body } = await request.get('https://randomfox.ca/floof');
			let noUser = client.utils.error('Пользователь не найден в базе данных.')
			try {
				var user = await client.users.fetch(interaction.member.user.id);
			} catch (error) {
				return message.channel.send({embeds: [noUser]})
			}
			let foxEmbed = client.utils.embed(undefined, undefined, user)
				.setImage(body.image)
			interaction.reply({embeds: [foxEmbed]})
		} catch(error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Fox;