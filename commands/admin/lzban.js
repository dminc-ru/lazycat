const { MessageEmbed, WebhookClient } = require("discord.js");
const webhookBan = new WebhookClient('795934524604416000', '2b4PbpsJc6AnzFDMGhTKElsvGE27bzXsBMTjlUZZ7V2G9tSJRf1lHPBpI5fMcFbxVPyZ');
let stats = require(`${process.env.PATHTOBASE}/stats.json`);
module.exports.run = async (client, message, args) => {
try{
	const argus = message.content.split(' ').slice(1);
	let user = message.mentions.users.first();
	let membermention;
    if (user) {
      membermention = await message.guild.members.fetch(user);
    }
	if (!user) {
		try {
		  const fetchedMember = await message.guild.members.fetch(argus.slice(0, 1).join(' '));
		  if (!fetchedMember) return;
		  membermention = fetchedMember;
		}
		catch (error) {
		  return message.channel.send(noUser);
		}
	}

	var member = await client.db.get(membermention.id, 'users');
	if (!member) return;
	if(member.permissions_lia == true) return;
	if(member.permissions_member == false) return;
	let reasonBan = argus.slice(1).join(' ');
	if(!reasonBan)
		reasonBan = `Нарушение Пользовательского соглашения`;
	client.db.change(membermention.id, 'users', 'permissions_member', 0);
	client.db.change(membermention.id, 'users', 'permissions_tester', 0);
	client.db.change(membermention.id, 'users', 'permissions_lia', 0);
	client.db.change(membermention.id, 'users', 'permissions_developer', 0);
	let lazyBan = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle(`Глобальная блокировка`)
		.setDescription(`Пользователь ${membermention.user.tag} успешно заблокирован в системе Lazy Cat.`)
		.setTimestamp()
		.setFooter(`${stats.version}`, client.user.displayAvatarURL());
   	client.users.cache.get(message.author.id).send(lazyBan);
	let newBan = new MessageEmbed()
		.setColor("#8b0000")
		.setTitle(`Пользователь заблокирован`)
		.setDescription(`Пользователю ограничен доступ к функциям`)
		.addField(`Причина`, `${reasonBan}`, false)
		.addField(`Срок`, `навсегда`, false)
		.addField(`Пользователь`, `${membermention.user.tag}`, true)
		.addField(`Модератор`, `${message.author.tag}`, true)
		.setTimestamp()
		.setFooter(`${stats.version} • Moderator ID: ${message.author.id} • User ID: ${membermention.id}`, client.user.displayAvatarURL());
	webhookBan.send(newBan);
	let lazyBanUser = new MessageEmbed()
		.setColor("#b88fff")
		.setTitle(`Глобальная блокировка`)
		.setDescription(`**Вы заблокированы в системе Lazy Cat.** Это означает, что вы больше не имеете доступа к любым функциям Lazy Cat. Если вы считаете, что блокировка выдана ошибочно, пожалуйста, заполните форму: https://forms.gle/VxxghNuiAJJt6AVL9`)
		.addField(`Причина`, `${reasonBan}`, false)
		.addField(`Срок`, `навсегда`, true)
		.addField(`Модератор`, `${message.author.id}`, true)
		.setTimestamp()
		.setFooter(`${stats.version}`, client.user.displayAvatarURL());
	try{client.users.cache.get(membermention.id).send(lazyBanUser);}catch(error){return;};
}catch(error){
			client.logger.log(`${error}`, "err")
		}
}

module.exports.help = {
	name: "lzban",
	aliases: [],
	permissions: ["lia"],
	modules: ["admin"]
}