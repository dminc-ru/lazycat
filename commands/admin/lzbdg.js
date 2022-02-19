const { MessageEmbed } = require("discord.js");
const fs = require("fs");
module.exports.run = async (client, message, args) => {
	let stats = client.json.stats
	let badgebase = client.json.badges
	try{
		const argus = message.content.split(' ').slice(1);
		switch(args[0]){

			case 'create': {
				if(!args[1] || !args[2] || !argus.slice(3)){
					let noCodename = client.utils.embed(`Значки: синтаксис`, `\`/lzbdg create <код> <эмодзи> <название>|<описание>\``, message.author)
					message.channel.send({embeds: [noCodename]});
					break;
				}
				let strings = argus.slice(3).split(/[|]/g);
				badgebase.push({
					codename: args[1],
					emoji: args[2],
					name: strings[0],
					description: strings[1],
					manualGiveaway: true
				});
				await client.saveJSON('badges', badgebase);
				let createdBadge = client.utils.embed('Значок создан.', undefined, message.author)
					.addField(`Код`, `\`${args[1]}\``, false)
					.addField(`Значок`, `${args[2]} ${strings[0]}`, false)
					.addField(`Описание`, `${strings[1]}`, false)
				message.channel.send({embeds: [createdBadge]});
				break;
			}

			case 'delete': {
				if(!args[1]){
					let noCodename = client.utils.embed(`Значки: синтаксис`, `\`/lzbdg delete <код>\``, message.author)
					message.channel.send({embeds: [noCodename]});
					break;
				}
				let badgeCheck = badgebase.findIndex((badge => badge.codename == args[1]));
				if(badgeCheck != -1){
					if (badgebase[badgeCheck].manualGiveaway == false) {
						let manualErr = client.utils.error('Этот значок не может быть удалён.', message.author)
						message.channel.send({embeds: [manualErr]})
						break
					} 
					badgebase.splice(badgeCheck, 1);
					await client.saveJSON('badges', badgebase)
					let deletedBadge = client.utils.success('Значок удалён.', message.author)
					message.channel.send({embeds: [deletedBadge]});
					break;
				}else{
					let deletedBadgeErr = client.utils.error('Значка не существует.', message.author)
					message.channel.send({embeds: [deletedBadgeErr]});
					break;
				}
			}

			case 'info': {
				if(!args[1]){
					let noCodename = client.utils.embed('Значки: синтаксис', `\`/lzbdg info <код>\``, message.author)
					message.channel.send({embeds: [noCodename]});
					break;
				};
				try{
					let bdg = badgebase.find(badg => badg.codename === args[1]);
					let fetchedBadge = client.utils.embed('Информация о значке', undefined, message.author)
						.addField(`Код`, `\`${args[1]}\``, false)
						.addField(`Значок`, `${bdg.emoji} ${bdg.name}`, true)
						.addField(`Доступен?`, `${(bdg.manualGiveaway) ? `да` : `нет`}`, true)
						.addField(`Описание`, `${bdg.description}`, false)
					message.channel.send({embeds: [fetchedBadge]});
					break;
				}catch(error){
					message.channel.send({embeds: [catchedError]});
					break;
				}
			}

			case 'test': {
				let strings = argus.slice(3).split(/[|]/g);
				let testBadge = client.utils.embed('Значок: проверка', undefined, message.author)
					.addField(`Код`, `\`${args[1]}\``, false)
					.addField(`Значок`, `${args[2]} ${strings[0]}`, false)
					.addField(`Описание`, `${strings[1]}`, false)
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
				let noCodename = client.utils.embed('Значки: список', list.join(`\n`), message.author)
				message.channel.send({embeds: [noCodename]});
				break;
			}

			case 'add': {
				let noUser = client.utils.error('Пользователь не найден.', message.author)
				let user = message.mentions.users.first();
				let membermention;
				if (user) {
					membermention = await message.guild.members.fetch(user);
					let found = badgebase.find(bdg => bdg.codename === args[2]);
					let noBadge = client.utils.error('Значок не зарегистрирован.', message.author)
					if(typeof found === 'undefined') {
						message.channel.send({embeds: [noBadge]});
						break;
					}
					var member = await client.db.getUser(membermention.id);
					if(!member){
						message.channel.send({embeds: [noUser]});
						break;
					}
					let notAvailable = client.utils.error('Этот значок недоступен для выдачи.', message.author)
					if (found.manualGiveaway == false) {
						message.channel.send({embeds: [notAvailable]})
						break;
					}
					if(!member.badges.includes(args[2])){
						let currentBadges = member.badges;
						if(currentBadges.length == 0) {
							client.db.changeUser(membermention.id, 'badges', `${args[2]},`)
						}
						else {
							client.db.changeUser(membermention.id, 'badges', `${currentBadges} ${args[2]},`);
						}
						let Success = client.utils.success(`Значок \`${args[2]}\` добавлен пользователю.`, message.author)
						message.channel.send({embeds: [Success]});
						break;
					}else{
						let alreadyHas = client.utils.error('Пользователь уже имеет значок.', message.author)
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
						let noBadge = client.utils.error('Значок не зарегистрирован.', message.author)
						if(typeof found === 'undefined') {
							message.channel.send(noBadge);
							break;
						}
						let notAvailable = client.utils.error('Этот значок недоступен для выдачи.', message.author)
						if (found.manualGiveaway == false) {
							message.channel.send({embeds: [notAvailable]})
							break
						}
						if(!member.badges.includes(args[2])){
							let currentBadges = member.badges;
							if(currentBadges.length == 0) {
								let stroka = `${args[2]},`
								client.db.changeUser(member.discord_id, 'badges', stroka)
							}
							else {
								let stroka = `${currentBadges}${args[2]},`
								client.db.changeUser(member.discord_id, 'badges', stroka);
							}
							let Success = client.utils.success(`Значок \`${args[2]}\` добавлен пользователю.`, message.author)
							message.channel.send({embeds: [Success]});
							break;
						}else{
							let alreadyHas = client.utils.error('Пользователь уже имеет этот значок.', message.author)
							message.channel.send({embeds: [alreadyHas]});
							break;
						}
					}catch (error) {
						client.logger.log(error, 'err')
						console.error(error)
						return message.channel.send({content: `Произошла ошибка при выполнении команды.`, ephemeral: true});
					}
				}
			}
			case 'remove': {
				let noUser = client.utils.error('Пользователь не найден')
				let user = message.mentions.users.first();
				let membermention;
				if (user) {
					membermention = await message.guild.members.fetch(user);
					let found = badgebase.find(bdg => bdg.codename === args[2]);
					let noBadge = client.utils.error('Значок не зарегистрирован.', message.author)
					if(typeof found === 'undefined'){ 
						message.channel.send(noBadge);
						break;
					}
					var member = await client.db.getUser(membermention.id);
					if(!member){
						message.channel.send(noUser);
						break;
					}
					let notAvailable = client.utils.error('Этот значок недоступен для удаления.', message.author)
					if (found.manualGiveaway == false) {
						message.channel.send({embeds: [notAvailable]})
						break
					}
					if(member.badges.includes(args[2])){
						let currentBadges = member.badges;
						let newBadges = currentBadges.replace(`${args[2]},`, '');
						client.db.changeUser(membermention.id, 'badges', newBadges);
						let Success = client.utils.success(`Значок \`${args[2]}\` удалён у пользователя.`, message.author)
						message.channel.send({embeds: [Success]});
						break;
					}else{
						let alreadyHas = client.utils.error('Пользователь не обладает этим значком.', message.author)
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
						let noBadge = client.utils.error('Значок не зарегистрирован.', message.author)
						if(typeof found === 'undefined') {
							message.channel.send({embeds: [noBadge]});
							break;
						}
						let notAvailable = client.utils.error('Этот значок недоступен для удаления.', message.author)
						if (found.manualGiveaway == false) {
							message.channel.send({embeds: [notAvailable]})
							break
						}
						if(member.badges.includes(args[2])){
							let currentBadges = member.badges;
							let newBadges = currentBadges.replace(`${args[2]},`, '');
							client.db.changeUser(member.discord_id, 'badges', newBadges);
							let Success = client.utils.success(`Значок \`${args[2]}\` удалён у пользователя.`, message.author)
							message.channel.send({embeds: [Success]});
							break;
						}else{
							let alreadyHas = client.utils.error('Пользователь не обладает этим значком.', message.author)
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
				let Syntax = client.utils.embed('Значки: синтаксис', undefined, message.author)
					.addField(`Субкоманда`, `\`create <код> <эмодзи> <название>|<описание>\` — создать значок
						\`info <код>\` — информация о значке 
						\`all\` — список всех значков 
						\`add <@User> <код>\` — добавить значок пользователю 
						\`remove <@User> <код>\` — удалить значок у пользователя`, false)
				message.channel.send({embeds: [Syntax]});
				break;
			}
		}
	}catch(error){
		client.logger.log(`${error}`, "err");
		console.error(error)
		message.channel.send({ content: `Произошла ошибка при выполнении команды.`})
	}
}

module.exports.data = {
	name: "lzbdg",
	permissions: ["tester"],
	type: "message"
}