let moment = require('moment');
const Command = require('../../class/Command')
class ServerInfo extends Command {
	constructor(client) {
		super(client, {
			name: 'сервер',
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
			try {
				var guild = await client.guilds.fetch(interaction.guildId);
			} catch (error) {
				return interaction.reply({content: 'Не могу получить доступ к серверу.', ephemeral: true})
			}
			function checkDays(date) {
				let now = new Date();
				let diff = now.getTime() - date.getTime();
				let days = Math.floor(diff / 86400000);
				return days + (days == 1 ? " день" : " дн.") + " назад";
			};
			let verifLevels = {
				"NONE": "-", 
				"LOW": "Низкий", 
				"MEDIUM": "Средний", 
				"HIGH": "Высокий", 
				"VERY_HIGH": "Самый высокий"
			};
			let region = {
				"en-US": ":flag_us: США",
				"en-GB": ":flag_gb: Великобритания",
				"bg": ":flag_bg: Болгария",
				"zh-CN": ":flag_cn: Китай",
				"zh-TW": ":flag_cn: Тайвань",
				"hr": ":flag_hr: Хорватия",
				"cs": ":flag_cz: Чехословакия",
				"da": ":flag_dk: Дания",
				"nl": ":flag_nl: Нидерланды",
				"fi": ":flag_fi: Финляндия",
				"fr": ":flag_fr: Франция",
				"de": ":flag_de: Германия",
				"el": ":flag_gr: Греция",
				"hi": ":flag_in: Индия",
				"hu": ":flag_hu: Венгрия",
				"it": ":flag_it: Италия",
				"ja": ":flag_jp: Япония",
				"ko": ":flag_kr: Корея",
				"lt": ":flag_lt: Литва",
				"no": ":flag_no: Норвегия",
				"pl": ":flag_pl: Польша",
				"pt-BR": ":flag_br: Бразилия",
				"ro": ":flag_ro: Румыния",
				"ru": ":flag_ru: Россия",
				"es-ES": ":flag_es: Испания",
				"sv-SE": ":flag_se: Швеция",
				"th": ":flag_th: Тайланд",
				"tr": ":flag_tr: Турция",
				"uk": ":flag_ua: Украина",
				"vi": ":flag_vn: Вьетнам"
			};
			let tier = {
				"NONE": "-",
				"TIER_1": "Друзья",
				"TIER_2": "Группы",
				"TIER_3": "Сообщества"
			}
			moment.locale("ru");
			const servercreated = moment(guild.createdAt).format('LL');
			let serverEmbed = client.utils.embed(`Информация о сервере ${guild.name}`, undefined, user)
				.setThumbnail(guild.iconURL())
				.addField('ID', interaction.guildId, true)
				.addField('Владелец', `<@${guild.ownerId}>`, true)
				.addField('Регион', region[guild.preferredLocale], true)
				.addField('Всего участников', `${guild.memberCount}`, true)
				.addField('Людей онлайн:', `${guild.members.cache.filter(member => !member.user.bot).size}`, true)
				.addField('Ботов онлайн:', `${guild.members.cache.filter(member => member.user.bot).size}`, true)
				.addField('Уровень верификации', verifLevels[guild.verificationLevel], true)
				.addField('Всего каналов', `${guild.channels.cache.size}`, true)
				.addField('Всего ролей', `${guild.roles.cache.size}`, true)
				.addField('Дата создания', `${servercreated} (${checkDays(guild.createdAt)})`, true)
				.addField('Всего бустов', `${guild.premiumSubscriptionCount}`, true)
				.addField('Уровень буста', `${tier[guild.premiumTier]}`)
			return interaction.reply({embeds: [serverEmbed]})
		} catch (error) {
			client.logger.log(error, 'err')
			console.error(error)
			interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
		}
	}
}

module.exports = ServerInfo;