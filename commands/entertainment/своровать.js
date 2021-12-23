const { MessageEmbed } = require('discord.js')
module.exports.run = async (client, interaction) => {
	let user = await client.users.fetch(interaction.member.user.id);
	let member = interaction.data.options[0].value;
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
		let failEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Воровство: неудача')
			.setDescription(`${client.emoji.fish} Неудача! Вас заметили, и вы пытаетесь скрыться.`)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [failEmbed]})
	}
	else{
		let stFish = randomSteal(1, 5)
		client.db.changeUser(memberdb.discord_id, 'balance_fish', (memberdb.balance_fish - stFish))
		client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + stFish))
		let successEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle('Воровство: успешно')
			.setDescription(`${client.emoji.fish} Шалость удалась! Вам зачислено ${stFish} ${client.emoji.fish}`)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
		return interaction.reply({embeds: [successEmbed]})
	};
}

module.exports.data = {
	name: "своровать",
	permissions: ["member"],
	type: "interaction"
}