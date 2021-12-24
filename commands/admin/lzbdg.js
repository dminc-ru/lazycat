const { MessageEmbed } = require("discord.js");
const fs = require("fs");
module.exports.run = async (client, message, args) => {
	let stats = require(`${client.config.jsonPath}stats.json`);
	let badgebase = require(`${client.config.jsonPath}badges.json`);
	try{
		const argus = message.content.split(' ').slice(1);
		switch(args[0]){

			case 'create': {
				if(!args[1] || !args[2] || !argus.slice(3)){
					let noCodename = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Значки: синтаксис`)
						.setDescription(`\`/lzbdg create <код> <эмодзи> <название>|<описание>\``)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					message.channel.send({embeds: [noCodename]});
					break;
				}
				let strings = argus.slice(3).join(' ').split(/[|]/g);
				badgebase.push({
					codename: args[1],
					emoji: args[2],
					name: strings[0],
					description: strings[1],
					manualGiveaway: true
				});
				fs.writeFileSync(`${client.config.jsonPath}badges.json`, JSON.stringify(badgebase, null, "\t"));
				let createdBadge = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Значок успешно создан.`)
					.addField(`Код`, `\`${args[1]}\``, false)
					.addField(`Значок`, `${args[2]} ${strings[0]}`, false)
					.addField(`Описание`, `${strings[1]}`, false)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				message.channel.send({embeds: [createdBadge]});
				break;
			}

			case 'delete': {
				if(!args[1]){
					let noCodename = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Значки: синтаксис`)
						.setDescription(`\`/lzbdg delete <код>\``)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					message.channel.send({embeds: [noCodename]});
					break;
				}
				let badgeCheck = badgebase.findIndex((badge => badge.codename == args[1]));
				if(badgeCheck != -1){
					if (badgebase[badgeCheck].manualGiveaway == false) {
						let manualErr = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Ошибка`)
							.setDescription(`Этот значок не может быть удалён`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
						message.channel.send({embeds: [manualErr]})
						break
					} 
					badgebase.splice(badgeCheck, 1);
					fs.writeFileSync(`${client.config.jsonPath}badges.json`, JSON.stringify(badgebase, null, "\t"));
					let deletedBadge = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Значок успешно удалён.`)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					message.channel.send({embeds: [deletedBadge]});
					break;
				}else{
					let deletedBadge = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Значка не существует.`)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					message.channel.send({embeds: [deletedBadge]});
					break;
				}
			}

			case 'info': {
				if(!args[1]){
					let noCodename = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Значки: синтаксис`)
						.setDescription(`\`/lzbdg info <код>\``)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					message.channel.send({embeds: [noCodename]});
					break;
				};
				try{
					let bdg = badgebase.find(badg => badg.codename === args[1]);
					let fetchedBadge = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Информация о значке`)
						.addField(`Код`, `\`${args[1]}\``, false)
						.addField(`Значок`, `${bdg.emoji} ${bdg.name}`, true)
						.addField(`Доступен?`, `${(bdg.manualGiveaway) ? `да` : `нет`}`, true)
						.addField(`Описание`, `${bdg.description}`, false)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					message.channel.send({embeds: [fetchedBadge]});
					break;
				}catch(error){
					message.channel.send({embeds: [catchedError]});
					break;
				}
			}

			case 'test': {
				let strings = argus.slice(3).join(' ').split(/[|]/g);
				let testBadge = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Значок: проверка`)
					.addField(`Код`, `\`${args[1]}\``, false)
					.addField(`Значок`, `${args[2]} ${strings[0]}`, false)
					.addField(`Описание`, `${strings[1]}`, false)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				message.channel.send({embeds: [testBadge]});
				break;
			}

			case 'all': {
				let list = [];
				badgebase.map(badge => {
					if (badge.manualGiveaway == false) {
						list.push(`${badge.emoji} ~~${badge.name} (${badge.codename})~~`)
					} else {
						list.push(`${badge.emoji} ${badge.name} (${badge.codename})`)
					}
				});
				let noCodename = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Значки: список`)
					.setDescription(`${list.join(`\n`)}`)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				message.channel.send({embeds: [noCodename]});
				break;
			}

			case 'add': {
				let noUser = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle("Ошибка")
					.setDescription(`Пользователь не найден.`)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				let user = message.mentions.users.first();
				let membermention;
				if (user) {
					membermention = await message.guild.members.fetch(user);
					let found = badgebase.find(bdg => bdg.codename === args[2]);
					let noBadge = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Ошибка`)
						.setDescription(`Значок не зарегистрирован.`)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					if(typeof found === 'undefined') {
						message.channel.send({embeds: [noBadge]});
						break;
					}
					var member = await client.db.getUser(membermention.id);
					if(!member){
						message.channel.send({embeds: [noUser]});
						break;
					}
					let notAvailable = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Ошибка`)
						.setDescription(`Этот значок не доступен для выдачи.`)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					if (found.manualGiveaway == false) {
						message.channel.send({embeds: [notAvailable]})
						break;
					}
					if(!member.badges.includes(args[2])){
						let currentBadges = member.badges;
						if(currentBadges.length == 0) {
							let stroka = `${args[2]},`
							client.db.changeUser(membermention.id, 'badges', stroka)
						}
						else {
							let stroka = `${currentBadges}, ${args[2]}`
							client.db.changeUser(membermention.id, 'badges', stroka);
						}
						let Success = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setTitle(`Успешно`)
								.setDescription(`Значок \`${args[2]}\` добавлен пользователю.`)
								.setTimestamp()
								.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						message.channel.send({embeds: [Success]});
						break;
					}else{
						let alreadyHas = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Ошибка`)
							.setDescription(`Пользователь уже имеет значок.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						message.channel.send({embeds: [alreadyHas]});
						break;
					}
				}
				if (!user) {
					try {
						var member = await client.db.getUser(args[1]);
						if(!member){
							message.channel.send({embeds: [noUser]});
							break;
						}
						let found = badgebase.find(bdg => bdg.codename === args[2]);
						let noBadge = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Ошибка`)
							.setDescription(`Значок не зарегистрирован.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						if(typeof found === 'undefined') {
							message.channel.send(noBadge);
							break;
						}
						let notAvailable = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Ошибка`)
							.setDescription(`Этот значок не доступен для удаления.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						if (found.manualGiveaway == false) {
							message.channel.send({embeds: [notAvailable]})
							break
						}
						if(!member.badges.includes(args[2])){
							let currentBadges = member.badges;
							if(currentBadges.length == 0) {
								let stroka = `${args[2]},`
								client.db.changeUser(membermention.id, 'badges', stroka)
							}
							else {
								let stroka = `${currentBadges}${args[2]},`
								client.db.changeUser(membermention.id, 'badges', stroka);
							}
							let Success = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setTitle(`Успешно`)
								.setDescription(`Значок \`${args[2]}\` добавлен пользователю.`)
								.setTimestamp()
								.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
							message.channel.send({embeds: [Success]});
							break;
						}else{
							let alreadyHas = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setTitle(`Ошибка`)
								.setDescription(`Пользователь уже имеет значок.`)
								.setTimestamp()
								.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
							message.channel.send({embeds: [alreadyHas]});
							break;
						}
					}catch (error) {
						return message.channel.send({embeds: [noUser]});
					}
				}
			}
			case 'remove': {
				let noUser = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle("Ошибка")
					.setDescription(`Пользователь не найден.`)
					.setTimestamp()
					.setFooter(`${stats.version}`, client.user.avatarURL());
				let user = message.mentions.users.first();
				let membermention;
				if (user) {
					membermention = await message.guild.members.fetch(user);
					let found = badgebase.find(bdg => bdg.codename === args[2]);
					let noBadge = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Ошибка`)
						.setDescription(`Значок не зарегистрирован.`)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					if(typeof found === 'undefined'){ 
						message.channel.send(noBadge);
						break;
					}
					var member = await client.db.getUser(membermention.id);
					if(!member){
						message.channel.send(noUser);
						break;
					}
					let notAvailable = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Ошибка`)
						.setDescription(`Этот значок не доступен для удаления.`)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					if (found.manualGiveaway == false) {
						message.channel.send({embeds: [notAvailable]})
						break
					}
					if(member.badges.includes(args[2])){
						let currentBadges = member.badges;
						let newBadges = currentBadges.replace(`${args[2]},`, '');
						client.db.changeUser(membermention.id, 'badges', newBadges);
						let Success = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Успешно`)
							.setDescription(`Значок \`${args[2]}\` удалён у пользователя.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						message.channel.send({embeds: [Success]});
						break;
					}else{
						let alreadyHas = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Ошибка`)
							.setDescription(`Пользователь не обладает этим значком.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						message.channel.send({embeds: [alreadyHas]});
						break;
					}
				}
				if (!user) {
					try {
						var member = await client.db.getUser(args[1]);
						if(!member){
							message.channel.send(noUser);
							break;
						}
						let found = badgebase.find(bdg => bdg.codename === args[2]);
						let noBadge = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Ошибка`)
							.setDescription(`Значок не зарегистрирован.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						if(typeof found === 'undefined') {
							message.channel.send({embeds: [noBadge]});
							break;
						}
						let notAvailable = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Ошибка`)
							.setDescription(`Этот значок не доступен для удаления.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						if (found.manualGiveaway == false) {
							message.channel.send({embeds: [notAvailable]})
							break
						}
						if(member.badges.includes(args[2])){
							let currentBadges = member.badges;
							let newBadges = currentBadges.replace(`${args[2]},`, '');
							client.db.changeUser(membermention.id, 'badges', newBadges);
							let Success = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setTitle(`Успешно`)
								.setDescription(`Значок \`${args[2]}\` удалён у пользователя.`)
								.setTimestamp()
								.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
							message.channel.send({embeds: [Success]});
							break;
						}else{
							let alreadyHas = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setTitle(`Ошибка`)
								.setDescription(`Пользователь не обладает этим значком.`)
								.setTimestamp()
								.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
							message.channel.send({embeds: [alreadyHas]});
							break;
						}
						}
					catch (error) {
						message.channel.send({embeds: [noUser]});
						break;
					}
				}
			}
			default: {
				let Syntax = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Значки: синтаксис`)
					.addField(`Субкоманда`, `\`create <код> <эмодзи> <название>|<описание>\` — создать значок
						\`info <код>\` — информация о значке 
						\`all\` — список всех значков 
						\`add <@User> <код>\` — добавить значок пользователю 
						\`remove <@User> <код>\` — удалить значок у пользователя`, false)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				message.channel.send({embeds: [Syntax]});
				break;
			}
		}
	}catch(error){
		client.logger.log(`${error}`, "err");
		console.error(error)
	}
}

module.exports.data = {
	name: "lzbdg",
	permissions: ["tester"],
	type: "message"
}