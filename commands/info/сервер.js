let moment = require('moment');
const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let guild = await client.guilds.fetch(interaction.guildId);
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
		"brazil": ":flag_br: Бразилия",
		"europe": ":flag_eu: Европа",
		"singapore": ":flag_sg: Сингапур",
		"us-central": ":flag_us: Центральная Америка",
		"sydney": ":flag_au: Сидней",
		"us-east": ":flag_us: Восточная Америка",
		"us-south": ":flag_us: Южная Америка",
		"us-west": ":flag_us: Западная Америка",
		"eu-west": ":flag_eu: Западная Европа",
		"vip-us-east": ":flag_us: VIP Восточная Америка",
		"london": ":flag_gb: Лондон",
		"amsterdam": ":flag_nl: Амстердам",
		"hongkong": ":flag_hk: Гонконг",
		"russia": ":flag_ru: Россия",
		"southafrica": ":flag_za:  Южная Африка",
		"india": ":flag_in: Индия",
		"japan": ":flag_jp: Япония"
	};
	moment.locale("ru");
	const servercreated = moment(guild.createdAt).format('LL');
	let serverEmbed = new MessageEmbed()
		.setColor(client.config.embedColor)
		.setTitle(`Информация о сервере ${guild.name}`)
		.setThumbnail(guild.iconURL())
		.addField('ID', interaction.guildId, true)
		.addField('Владелец', `<@${guild.owner.user.id}>`, true)
		.addField('Регион', region[guild.region], true)
		.addField('Всего участников', guild.memberCount, true)
		.addField('Людей', guild.members.cache.filter(member => !member.user.bot).size, true)
		.addField('Ботов', guild.members.cache.filter(member => member.user.bot).size, true)
		.addField('Уровень верификации', verifLevels[guild.verificationLevel], true)
		.addField('Всего каналов', guild.channels.cache.size, true)
		.addField('Всего ролей', guild.roles.cache.size, true)
		.addField('Дата создания', `${servercreated} (${checkDays(guild.createdAt)})`, true)
		.addField('Всего бустов', guild.premiumSubscriptionCount, true)
		.addField('Уровень буста', guild.premiumTier)
		.setTimestamp()
		.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
	return interaction.reply({embeds: [serverEmbed]})
}

module.exports.data = {
	name: "сервер",
	permissions: ["member"],
	type: "interaction"
}