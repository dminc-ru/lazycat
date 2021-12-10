const { MessageEmbed } = require("discord.js");
let stats = require(`${process.env.PATHTOBASE}/stats.json`);
module.exports.run = async (client, message, args) => {
	if(message.author.id != '561822820632494081')
		return;
	
	
	const cleann = text => {
		if (typeof(text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
			return text;
	}
	const code = args.join(" ");
	try {
      let evaled = await eval("(async () => {" + code + "})()");
 
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
	  let embedEval = new MessageEmbed()
		.setColor("#b88fff")
		.addField(':inbox_tray: Input:', `\`\`\`js\n${code}\n\`\`\``, false)
		.addField(':outbox_tray: Output:', `\`\`\`js\n${cleann(evaled)}\n\`\`\``, false)
		.setTimestamp()
		.setFooter(`${stats.version}`, client.user.avatarURL());
      message.channel.send(embedEval);
    } catch (err) {
		let embedEval = new MessageEmbed()
			.setColor("#b88fff")
			.addField(':inbox_tray: Input:', `\`\`\`js\n${code}\n\`\`\``, false)
			.addField(':outbox_tray: Output:', `\`\`\`js\n${cleann(err)}\n\`\`\``, false)
			.setTimestamp()
			.setFooter(`${stats.version}`, client.user.avatarURL());
      message.channel.send(embedEval);
    }
}



module.exports.help = {
	name: "lzeval",
	aliases: [],
	permissions: ["developer"],
	modules: ["admin"]
}