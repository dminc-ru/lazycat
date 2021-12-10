let moment = require('moment');
module.exports.run = async (client, interaction) => {
	try{
		let user = client.users.cache.get(interaction.member.user.id);
		let guild = client.guilds.cache.get(interaction.guild_id);
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
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: `Информация о сервере ${guild.name}`,
							thumbnail: {
								url: `${guild.iconURL()}`
							},
							fields: [
								{
									name: "ID",
									value: `${interaction.guild_id}`,
									inline: true
								},
								{
									name: "Владелец",
									value: `<@${guild.owner.user.id}>`,
									inline: true
								},
								{
									name: "Регион",
									value: `${region[guild.region]}`,
									inline: true
								},
								{
									name: "Всего участников",
									value: `${guild.memberCount}`,
									inline: true
								},
								{
									name: "Людей",
									value: `${guild.members.cache.filter(member => !member.user.bot).size}`,
									inline: true
								},
								{
									name: "Ботов",
									value: `${guild.members.cache.filter(member => member.user.bot).size}`,
									inline: true
								},
								{
									name: "Уровень верификации",
									value: `${verifLevels[guild.verificationLevel]}`,
									inline: true
								},
								{
									name: "Всего каналов",
									value: `${guild.channels.cache.size}`,
									inline: true
								},
								{
									name: "Всего ролей",
									value: `${guild.roles.cache.size}`,
									inline: true
								},
								{
									name: "Дата создания",
									value: `${servercreated} (${checkDays(guild.createdAt)})`,
									inline: true
								},
								{
									name: "Всего бустов",
									value: `${guild.premiumSubscriptionCount}`,
									inline: true
								},
								{
									name: "Уровень буста",
									value: `${guild.premiumTier}`
								}
							],
							timestamp: new Date(),
							footer: {
								text: `${user.tag}`,
								icon_url: `${user.displayAvatarURL()}`,
							}
						}
					]
				}
			}
		});
	}catch(error){
		client.logger.log(`${error}`, "err");
	}
}

module.exports.help = {
	name: "сервер",
	aliases: ["cthdth"],
	permissions: ["member"],
	modules: ["info"]
}