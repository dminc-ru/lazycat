const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	try {
		function randomHelp(min, max) {
			let rand = min - 0.5 + Math.random() * (max - min + 1);
			return Math.round(rand);
		}
		let noUser = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Ошибка')
			.setDescription('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return message.channel.send({embeds: [noUser]})
		}
		let pegg = randomHelp(1, 250);
		if(pegg == 55) {
			let eggEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle('Команды Lazy Cat:')
				.setImage('https://thumbs.gfycat.com/SoftFlimsyBufeo-size_restricted.gif')
				.setTimestamp()
				.setFooter({ text: `${user.tag} • Команды: /помощь`, iconURL: user.displayAvatarURL({dynamic: true}) })
			interaction.reply({embeds: [eggEmbed]})
		}
		let prefix = '/';
		let helpEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Команды Lazy Cat:')
			.setDescription(`[Официальная документация](https://lazycat.dminc.ru)
				[**Добавить на свой сервер**](${client.config.inviteLink})`)
			.addField('Информация:', `\`${prefix}помощь\` \`${prefix}профиль\` \`${prefix}инфо\` \`${prefix}донат\` \`${prefix}корона\` \`${prefix}погода\` \`${prefix}описание\` \`${prefix}сервер\``, false)
			.addField('Развлекательные:', `\`${prefix}кот\` \`${prefix}лис\` \`${prefix}своровать\` \`${prefix}пример\` \`${prefix}покрути\``, false)
			.addField('Модерация:', `\`${prefix}бан\` \`${prefix}мут\` \`${prefix}кик\` \`${prefix}удалить\` \`${prefix}мутроль\` \`${prefix}размут\` \`${prefix}разбан\` \`${prefix}привет\` \`${prefix}пока\` \`${prefix}стартроль\``, false)
			.addField('Технические:', `\`${prefix}пинг\` \`${prefix}проверка\``, false)
			.addField('Кейсы:', `\`${prefix}инвентарь\` \`${prefix}кейс\` \`${prefix}мегакейс\` \`${prefix}лакикейс\` \`${prefix}продать\``, false)
			.addField('Экономика:', `\`${prefix}передать\` \`${prefix}магазин\` \`${prefix}жучки\` \`${prefix}баланс\` \`${prefix}банк\` \`${prefix}работа\``, false)
			.addField('Радио:', `\`${prefix}плей\` \`${prefix}пауза\` \`${prefix}скип\` \`${prefix}стоп\` \`${prefix}повтор\` \`${prefix}поиск\` \`${prefix}сейчас\`  \`${prefix}фильтр\` \`${prefix}очередь\` \`${prefix}очистить\` \`${prefix}громкость\` \`${prefix}дисконнект\` \`${prefix}увед\` \`${prefix}плейлист\` \`${prefix}перемешать\``, false)
			.setTimestamp()
			.setFooter({ text: `${user.tag} • Команды: /помощь`, iconURL: user.displayAvatarURL({dynamic: true}) })
		interaction.reply({embeds: [helpEmbed]})
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "помощь",
	permissions: ["member"],
	type: "interaction"
}