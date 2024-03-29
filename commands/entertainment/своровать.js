const Command = require('../../class/Command')
class Rob extends Command {
	constructor(client) {
		super(client, {
			name: 'своровать',
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
			let member = interaction.options.getUser('участник');
			function randomSteal(min, max) {
				let rand = min - 0.5 + Math.random() * (max - min + 1);
				return Math.round(rand);
			}
			let memberdb = await client.db.getUser(interaction.member.user.id)
			let userdb = await client.db.getUser(interaction.member.user.id)
			if(member == interaction.member.user.id)
				return interaction.reply({content: "Вы не можете своровать рыбки у самого себя.", ephemeral: true})
			if(!memberdb)
				return interaction.reply({content: "Указанный пользователь не зарегистрирован в системе Lazy Cat.", ephemeral: true})
			if(memberdb.balance_fish < 50)
				return interaction.reply({content: "Этот пользователь не имеет так много рыбок, чтобы его можно было обокрасть.", ephemeral: true})
			if(member == 707539807957680129){
				return interaction.reply({content: "Внимательный котик вас заметил, а вы его нет. Кажется, это бесполезно.", ephemeral: true})
			}
			let tryin = randomSteal(1, 100)
			if(tryin < 30){
				let failEmbed = client.utils.embed('Воровство: неудача', `${client.emoji.fish} Неудача! Вас заметили, и вы пытаетесь скрыться.`, user)
				return interaction.reply({embeds: [failEmbed]})
			}
			else{
				let stFish = randomSteal(1, 5)
				client.db.changeUser(memberdb.discord_id, 'balance_fish', (memberdb.balance_fish - stFish))
				client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + stFish))
				let successEmbed = client.utils.success(`Шалость удалась! Вам зачислено ${stFish} ${client.emoji.fish}`, user)
				return interaction.reply({embeds: [successEmbed]})
			};
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Rob;