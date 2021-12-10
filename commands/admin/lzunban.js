const { MessageEmbed, WebhookClient } = require("discord.js");
const webhookBan = new WebhookClient('795934524604416000', '2b4PbpsJc6AnzFDMGhTKElsvGE27bzXsBMTjlUZZ7V2G9tSJRf1lHPBpI5fMcFbxVPyZ');
let stats = require(`${process.env.PATHTOBASE}/stats.json`);
let users = require(`${process.env.PATHTOBASE}/users.json`);
module.exports.run = async (client, message, args) => {
try{
	const argus = message.content.split(' ').slice(1);
	if(!users[message.author.id].permissions.lia)
		return;
	let user = message.mentions.users.first();
	let membermention;
    if (user) {
      membermention = await message.guild.members.fetch(user);
    }
	if (!user) {
		try {
		  const fetchedMember = await message.guild.members.fetch(argus.slice(0, 1).join(' '));
		  if (!fetchedMember) return message.channel.send(noUser);
		  user = fetchedMember;
		  membermention = fetchedMember;
		  user = user.user;
		}
		catch (error) {
		  return message.channel.send(noUser);
		}
	}
	var member = await client.db.get(membermention.id, 'users');
	member = member[0];
	if (!member) return;
	if(member.permissions_lia == true) return;
	if(member.permissions_member == true) return;

	let reasonUnban = argus.slice(1).join(' ');
	if(!reasonUnban)
		reasonUnban = `Рассмотрение апелляции`
	client.db.change(membermention.id, 'users', 'permissions_member', 1);
	let lazyBan = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle(`Глобальная разблокировка`)
		.setDescription(`Пользователь ${membermention.user.tag} успешно разблокирован в системе Lazy Cat.`)
		.setTimestamp()
		.setFooter(`${stats.version}`, client.user.avatarURL());
   	client.users.cache.get(message.author.id).send(lazyBan);
	let newUnban = new MessageEmbed()
		.setColor("#8b0000")
		.setTitle(`Пользователь разблокирован`)
		.setDescription(`Пользователю предоставлен доступ к функциям`)
		.addField(`Причина`, `${reasonUnban}`, false)
		.addField(`Пользователь`, `${membermention.user.tag}`, true)
		.addField(`Модератор`, `${message.author.tag}`, true)
		.setTimestamp()
		.setFooter(`${stats.version} • Moderator ID: ${message.author.id} • User ID: ${membermention.id}`, client.user.avatarURL());
	webhookBan.send(newUnban);
	let lazyUnbanUser = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle(`Глобальная разблокировка`)
		.setDescription(`**Вы разблокированы в системе Lazy Cat.** Это означает, что вам предоставлен доступ к функциям Lazy Cat.`)
		.addField(`Причина`, `${reasonUnban}`, true)
		.setTimestamp()
		.setFooter(`${stats.version}`, client.user.avatarURL());
	try{client.users.cache.get(membermention.id).send(lazyUnbanUser);}catch(error){return;};
}catch(error){
			client.logger.log(`${error}`, "err")
		}
}

module.exports.help = {
	name: "lzunban",
	aliases: [],
	permissions: ["lia"],
	modules: ["admin"]
}