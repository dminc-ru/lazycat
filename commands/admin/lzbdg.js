const { MessageEmbed } = require("discord.js");
const fs = require("fs");
let stats = require(`${client.config.jsonPath}stats.json`);
let badgebase = require(`${client.config.jsonPath}/badges.json`);
module.exports.run = async (client, message, args) => {
try{
	const argus = message.content.split(' ').slice(1);
	switch(args[0]){

		case 'create': {
			if(!args[1] || !args[2] || !argus.slice(3)){
				let noCodename = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Значки: синтаксис`)
					.setDescription(`/lzbdg create <codename> <emoji> <name>|<description>`)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				message.channel.send(noCodename);
				break;
			}
			let strings = argus.slice(3).join(' ').split(/[|]/g);
			badgebase.push({
				codename: args[1],
				emoji: args[2],
				name: strings[0],
				description: strings[1]
			});
			fs.writeFileSync(`${client.config.jsonPath}badges.json`, JSON.stringify(badgebase, null, "\t"));
			let createdBadge = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Значок успешно создан.`)
				.addField(`Codename`, `${args[1]}`, false)
				.addField(`Emoji`, `${args[2]}`, false)
				.addField(`Name`, `${strings[0]}`, false)
				.addField(`Description`, `${strings[1]}`, false)
				.setTimestamp()
				.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
			message.channel.send(createdBadge);
			break;
		}

		case 'delete': {
			if(!args[1]){
				let noCodename = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Значки: синтаксис`)
					.setDescription(`/lzbdg delete <codename>`)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				message.channel.send(noCodename);
				break;
			}
			let badgeCheck = badgebase.findIndex((badge => badge.codename == args[1]));
			if(badgeCheck != -1){
				badgebase.splice(badgeCheck, 1);
				fs.writeFileSync(`${client.config.jsonPath}badges.json`, JSON.stringify(badgebase, null, "\t"));
				let deletedBadge = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Значок успешно удалён.`)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				message.channel.send(deletedBadge);
				break;
			}else{
				let deletedBadge = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Значка не существует.`)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				message.channel.send(deletedBadge);
				break;
			}
		}

		case 'info': {
			if(!args[1]){
				let noCodename = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Значки: синтаксис`)
					.setDescription(`/lzbdg info <codename>`)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				message.channel.send(noCodename);
				break;
			};
			try{
				let bdgEmoji = badgebase.find(badg => badg.codename === args[1]).emoji;
				let bdgName = badgebase.find(badg => badg.codename === args[1]).name;
				let bdgDesc = badgebase.find(badg => badg.codename === args[1]).description;
				let fetchedBadge = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setTitle(`Информация о значке`)
					.addField(`Codename`, `${args[1]}`, false)
					.addField(`Emoji`, `${bdgEmoji}`, false)
					.addField(`Name`, `${bdgName}`, false)
					.addField(`Description`, `${bdgDesc}`, false)
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
				message.channel.send(fetchedBadge);
				break;
			}catch(error){
				message.channel.send(catchedError);
				break;
			}
		}

		case 'test': {
			let strings = argus.slice(3).join(' ').split(/[|]/g);
			let testBadge = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Arguments`)
				.addField(`Codename`, `${args[1]}`, false)
				.addField(`Emoji`, `${args[2]}`, false)
				.addField(`Name`, `${strings[0]}`, false)
				.addField(`Description`, `${strings[1]}`, false)
				.setTimestamp()
				.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
			message.channel.send(testBadge);
			break;
		}

		case 'all': {
			let list = [];
			badgebase.map(badge => {
				list.push(`${badge.codename}`)
			});
			let noCodename = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Значки: список`)
				.setDescription(`${list}`)
				.setTimestamp()
				.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
			message.channel.send(noCodename);
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
					message.channel.send(noBadge);
					break;
				}
				var member = await client.db.getUser(membermention.id);
				if(!member){
					message.channel.send(noUser);
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
							.setDescription(`Значок ${args[2]} добавлен пользователю.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					message.channel.send(Success);
					break;
				}else{
					let alreadyHas = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Ошибка`)
						.setDescription(`Пользователь уже имеет значок.`)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					message.channel.send(alreadyHas);
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
						message.channel.send(noBadge);
						break;
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
							.setDescription(`Значок ${args[2]} добавлен пользователю.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						message.channel.send(Success);
						break;
					}else{
						let alreadyHas = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Ошибка`)
							.setDescription(`Пользователь уже имеет значок.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						message.channel.send(alreadyHas);
						break;
					}
				}catch (error) {
					return message.channel.send(noUser);
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
				if(member.badges.includes(args[2])){
					let currentBadges = member.badges;
					let newBadges = currentBadges.replace(`${args[2]},`, '');
					client.db.change_user(membermention.id, 'badges', newBadges);
					let Success = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Успешно`)
						.setDescription(`Значок ${args[2]} удалён у пользователя.`)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					message.channel.send(Success);
					break;
				}else{
					let alreadyHas = new MessageEmbed()
						.setColor(client.config.embedColor)
						.setTitle(`Ошибка`)
						.setDescription(`Пользователь не обладает этим значком.`)
						.setTimestamp()
						.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
					message.channel.send(alreadyHas);
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
						message.channel.send(noBadge);
						break;
					}
					if(member.badges.includes(args[2])){
						let currentBadges = member.badges;
						let newBadges = currentBadges.replace(`${args[2]},`, '');
						client.db.changeUser(membermention.id, 'badges', newBadges);
						let Success = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Успешно`)
							.setDescription(`Значок ${args[2]} удалён у пользователя.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						message.channel.send(Success);
						break;
					}else{
						let alreadyHas = new MessageEmbed()
							.setColor(client.config.embedColor)
							.setTitle(`Ошибка`)
							.setDescription(`Пользователь не обладает этим значком.`)
							.setTimestamp()
							.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
						message.channel.send(alreadyHas);
						break;
					}
					}
				catch (error) {
					message.channel.send(noUser);
					break;
				}
			}
		}
		default: {
			let Syntax = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Значки: синтаксис`)
				.addField(`Субкоманда`, `create, info, all, add, remove`, false)
				.setTimestamp()
				.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
			message.channel.send(Syntax);
			break;
		}
	}
}catch(error){
			client.logger.log(`${error}`, "err");
		}
}

module.exports.data = {
	name: "lzbdg",
	permissions: ["tester"],
	type: "message"
}