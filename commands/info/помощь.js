module.exports.run = async (client, interaction) => {
try{
	function randomHelp(min, max) {
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}
	let user = client.users.cache.get(interaction.member.user.id);
	let pegg = randomHelp(1, 250);
	if(pegg == 55) {
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							color: 0xb88fff,
							title: "Команды Lazy Cat:",
							timestamp: new Date(),
							footer: {
								text: `${user.tag} • Команды: /помощь`,
								icon_url: `${user.displayAvatarURL()}`,
							},
							image: {
								url: 'https://thumbs.gfycat.com/SoftFlimsyBufeo-size_restricted.gif',
							},
						}
					]
				}
			}
		});
	}
	let prefix = '/';
	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				embeds: [
					{
						color: 0xb88fff,
						title: "Команды Lazy Cat:",
						description: `[Официальная документация](https://lazycat.dminc.ru)\n[**Добавить на свой сервер**](https://discord.com/oauth2/authorize?client_id=707539807957680129&permissions=2666900726&scope=bot%20applications.commands)`,
						timestamp: new Date(),
						fields: [
							{
								name: 'Информация:',
								value: `\`${prefix}помощь\` \`${prefix}профиль\` \`${prefix}инфо\` \`${prefix}донат\` \`${prefix}корона\` \`${prefix}погода\` \`${prefix}описание\` \`${prefix}сервер\``,
								inline: false
							},
							{
								name: 'Развлекательные:',
								value: `\`${prefix}кот\` \`${prefix}лис\` \`${prefix}своровать\` \`${prefix}пример\` \`${prefix}покрути\``,
								inline: false
							},
							{
								name: 'Модерация:',
								value: `\`${prefix}бан\` \`${prefix}мут\` \`${prefix}кик\` \`${prefix}удалить\` \`${prefix}мутроль\` \`${prefix}размут\` \`${prefix}разбан\` \`${prefix}привет\` \`${prefix}пока\` \`${prefix}стартроль\``,
								inline: false
							},
							{
								name: 'Технические:',
								value: `\`${prefix}пинг\` \`${prefix}проверка\``,
								inline: false
							},
							{
								name: 'Кейсы:',
								value: `\`${prefix}инвентарь\` \`${prefix}кейс\` \`${prefix}мегакейс\` \`${prefix}лакикейс\` \`${prefix}продать\``,
								inline: false
							},
							{
								name: 'Экономика:',
								value: `\`${prefix}передать\` \`${prefix}магазин\` \`${prefix}жучки\` \`${prefix}баланс\` \`${prefix}банк\` \`${prefix}работа\``,
								inline: false
							},
							{
								name: 'Радио:',
								value: `\`${prefix}плей\` \`${prefix}пауза\` \`${prefix}скип\` \`${prefix}стоп\` \`${prefix}повтор\` \`${prefix}поиск\` \`${prefix}сейчас\`  \`${prefix}фильтр\` \`${prefix}очередь\` \`${prefix}очистить\` \`${prefix}громкость\` \`${prefix}дисконнект\` \`${prefix}увед\` \`${prefix}плейлист\` \`${prefix}перемешать\``,
								inline: false
							}
						],
						footer: {
							text: `${user.tag} • Команды: /помощь`,
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
	name: "помощь",
	aliases: ["gjvjom", "хелп", "хэлп", "команды"],
	permissions: ["member"],
	modules: ["info"]
}