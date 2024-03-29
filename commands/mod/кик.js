const Command = require('../../class/Command')
class Kick extends Command {
	constructor(client) {
		super(client, {
			name: 'кик',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: true
		})
	}

	async run (client, interaction) {
		try {
			try {
				var user = await client.users.fetch(interaction.member.user.id)
				var guild = await client.guilds.fetch(interaction.guildId)
				var member = await guild.members.fetch(interaction.member.user.id)
				var toKick = interaction.options.getUser('участник');
				var toKickClientResolve = await client.users.fetch(toKick)
				var toKickResolve = await guild.members.fetch(toKick);
			} catch (error) {
				return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
			}
			let guilddb = await client.db.getGuild(interaction.guildId)
			if ( !member.permissions.has('KICK_MEMBERS') ) {
				return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
			}
			if(toKickResolve){
				const memberPosition = toKickResolve.roles.highest.position;
				const moderationPosition = member.roles.highest.position;
				if ( !(moderationPosition > memberPosition) || !toKickResolve.kickable) {
					return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
				}
			} else {
				return interaction.reply({content: `Пользователь не найден.`, ephemeral: true})
			}
			if (toKick == interaction.member.user.id) {
				return interaction.reply({content: `Вы не можете кикнуть себя.`, ephemeral: true})
			}
			if (toKick == client.user.id) {
				return interaction.reply({content: `У вас недостаточно прав для выполнения данного действия.`, ephemeral: true})
			}
			var reason = interaction.options.getString('причина')
			if (!reason) {
				var reason = `не указана`;
			}
			try{
				toKickResolve.kick(`[ ${user.tag} ]: «${reason}»`);
			} catch(error) {
				console.log(error)
				return interaction.reply({content: `Произошла ошибка при попытке кика. Возможно, у меня недостаточно прав для выполнения этого действия.`, ephemeral: true})
			}
			let usernames = toKickClientResolve.tag;
			let kickMessage = client.utils.embed('Кик: успешно', undefined, user)
				.addField('Модератор:', `<@${user.id}>`, true)
				.addField('Пользователь:', `${usernames}`, true)
				.addField('Причина:', `${reason}`, false)
			interaction.reply({embeds: [kickMessage]})
			if(guilddb.logmsg_channel != ""){
				try {
					const channel = await guild.channels.fetch(guilddb.logmsg_channel);
					let muteMessage = client.utils.embed('Кик: успешно', undefined, user)
					.addField('Модератор:', `<@${user.id}>`, true)
					.addField('Пользователь:', `${usernames}`, true)
					.addField('Причина:', `${reason}`, false)
					return channel.send(muteMessage);
				} catch(error) {
					client.db.changeGuild(interaction.guildId, 'logmsg_channel', '');
				}
			}
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Kick;