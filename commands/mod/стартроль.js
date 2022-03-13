const { MessageEmbed } = require('discord.js')
const Command = require('../../class/Command')
class GiveRole extends Command {
	constructor(client) {
		super(client, {
			name: 'стартроль',
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
			if ( !member.permissions.has('ADMINISTRATOR') ) {
				return interaction.reply({content: `У вас недостаточно прав для выполнения этой команды.`, ephemeral: true})
			}
			if (whattoDo == 'выкл') {
				if (guilddb.giveRole == "false") {
					return interaction.reply({content: `Автоматическая выдача роли уже отключена. Включить — /стартроль вкл`, ephemeral: true})
				}
				if (guilddb.welcomeRole == '') {
					return interaction.reply({content: `Сначала необходимо установить роль — /стартроль установить <@Роль>`, ephemeral: true})
				}
				client.db.changeGuild(interaction.guildId, 'giveRole', 'false')
				let autoRoleDisabled = client.utils.success('Автоматическая выдача роли новым участникам отключена. Включить снова — /стартроль вкл', user)
				return interaction.reply({embeds: [autoRoleDisabled]})
			}
			if (whattoDo == 'вкл') {
				if (guilddb.giveRole == 'true') {
					return interaction.reply({content: `Автоматическая выдача роли уже включена. Отключить — /стартроль выкл`, ephemeral: true})
				}
				if (guilddb.welcomeRole == '') {
					return interaction.reply({content: `Сначала необходимо установить роль — /стартроль установить @Роль`, ephemeral: true})
				}
				client.db.changeGuild(interaction.guildId, 'giveRole', 'true')
				let autoRoleEnabled = client.utils.success('Автоматическая выдача роли новым участникам включена. Отключить — /стартроль выкл', user)
				return interaction.reply({embeds: [autoRoleEnabled]})
			}
			startRole = interaction.options.getRole('роль');
			client.db.changeGuild(interaction.guildId, 'welcomeRole', startRole)
			let successEmbed = client.utils.success('Теперь эта роль будет выдаваться всем участникам. Выдачу роли можно отключить командой /стартроль выкл', user)
			return interaction.reply({embeds: [successEmbed]})
		} catch(error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = GiveRole;