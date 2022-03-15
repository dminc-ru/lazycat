let cooldown = new Set();
const { MessageEmbed } = require('discord.js')
let cdseconds = 3;
module.exports = async (client, message) => {
	if (!message.content.startsWith('/')) return
	const args = message.content.slice(1).split(" ");
	if (message.author.id == client.user.id)
		return;
	const lzcmd = args.shift().toLowerCase();
	var user = await client.db.getUser(message.author.id);
	let fetchedUser = await client.users.fetch(message.author.id)
	if(!user){
		await client.db.addUser(message.author.id);
		user = await client.db.getUser(message.author.id);
	}
	if(!user){
		client.logger.log(`Ошибка получения данных. User ID: ${message.author.id}`, 'err');
		let dataError = new MessageEmbed()
			.setColor('#b88fff')
			.setTitle('Ошибка')
			.setDescription('Произошла ошибка. Попробуйте ещё раз или обратитесь на наш сервер поддержки.\nКод ошибки: LZE-179')
			.setTimestamp()
			.setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}));
		return message.channel.send(dataError)
	}
	let commandfile = client.commands.get(lzcmd);
	if(commandfile) {
		switch (commandfile.data.permissions) {
			case 'tester': {
				if(user.permissions_tester != true)
					return;
				break;
			}
			case 'lia': {
				if(user.permissions_lia != true)
					return;
				break;
			}
			case 'developer': {
				if(user.permissions_developer != true)
					return;
				break;
			}
			default: break;
		}
		cooldown.add(message.author.id);
		let stats = client.json.stats
		stats.commands += 1
		client.saveJSON('stats', stats)
		client.logger.log(`MESSAGE || ${fetchedUser.tag} || ${message.author.id} || ${lzcmd}`, 'cmd')
		if (commandfile.data.type == "message") {
			if (commandfile.data.enabled)
				commandfile.run(client, message, args);
			else return
		}else {
			return
		}
	}else{
		return;
	}
	setTimeout(() => {
		cooldown.delete(message.author.id)
	}, cdseconds * 1000);
};