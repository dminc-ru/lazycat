const Command = require('../../class/Command')
class Ban extends Command {
	constructor(client) {
		super(client, {
			name: 'бан',
			permissions: ['member'],
			type: 'interaction',
			enabled: true,
			guildOnly: true
		})
	}

	async run (client, interaction) {
		try {
			try {
				var user = await client.users.fetch(interaction.member.user.id);
				var guild = await client.guilds.fetch(interaction.guildId);
				var member = await guild.members.fetch(interaction.member.user.id);
			} catch (error) {
				return interaction.reply({content: `Произошла ошибка при получении данных.`, ephemeral: true})
			}
			let guilddb = await client.db.getGuild(interaction.guildId)
			if (!member.permissions.has('BAN_MEMBERS')) {
				return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
			}
			var banUser = interaction.options.getUser('участник');
			var banUserResolve = await guild.members.fetch(banUser);
			if (!banUserResolve) {
				return interaction.reply({content: `Пользователь не найден.`, ephemeral: true})
			}
			const memberPosition = banUserResolve.guild.roles.highest.position;
			const moderationPosition = member.guild.roles.highest.position;
			if (guild.ownerId != banUser && moderationPosition < memberPosition) {
				return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
			}
			if (!banUserResolve.bannable) {
				return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
			}
			if (banUser == interaction.member.user.id) {
				return interaction.reply({content: `Вы не можете забанить себя.`, ephemeral: true})
			}
			const banned = await guild.bans.fetch();
				if (banned.some((m) => m.user.id === banUser)) {
					return interaction.reply({content: `Пользователь уже забанен.`, ephemeral: true})
				}
			var reason = interaction.options.getString('причина')
			if (!reason) {
				var reason = `не указана`
			}
			if (reason.length > 500) {
				return interaction.reply({content: `Максимальное количество символов для причины — 500.`, ephemeral: true})
			}
			if (banUser == client.user.id) {
				return interaction.reply({content: `У вас недостаточно прав для выполнения данного действия.`, ephemeral: true})
			}
			try {
				banUserResolve.ban({reason: `[ ${user.tag} ]: «${reason}»`});
			} catch (error) {
				return interaction.reply({content: `Произошла ошибка при попытке бана. Возможно, у меня недостаточно прав для выполнения этого действия.`})
			}
			let banMessage = client.utils.embed('Бан: успешно', undefined, user)
				.addField(`Модератор:`, `<@${user.id}>`, true)
				.addField(`Пользователь:`, `<@${banUserResolve.user.id}>`, true)
				.addField(`Причина:`, reason, false)
			interaction.reply({embeds: [banMessage]})
			if(guilddb.logmsg_channel != ""){
				try{
					let banMessage = client.utils.embed('Бан: успешно', undefined, user)
						.addField(`Модератор:`, `<@${user.id}>`, true)
						.addField(`Пользователь:`, `<@${banUserResolve.user.id}>`, true)
						.addField(`Причина:`, `${reason}`, false)
					const channel = guild.channels.fetch(guilddb.logmsg_channel);
					channel.send(banMessage);
				}catch(error){
					client.db.changeGuild(interaction.guildId, 'logmsg_channel', '')
				}
			}
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = Ban;