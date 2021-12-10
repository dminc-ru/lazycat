const { MessageEmbed } = require("discord.js");
const beautify = require('js-beautify').js;
module.exports.run = async (client, message, args) => {
	if(message.author.id != '561822820632494081')
		return;
	const code = args.join(" ");
	const result = new Promise((resolve) => resolve(eval(code)));
	return result.then((output) => {
		if (typeof output !== "string") {
			output = require('util').inspect(output, { depth: 0 });
		}
		if (output.includes(client.config.token)) {
			output = output.replace(client.config.token, "[REDACTED]")
		}
		if (output.includes(client.config.webhookBanToken)) {
			output = output.replace(client.config.webhookBanToken, "[REDACTED]")
		}
		if (output.includes(client.config.secretKey)) {
			output = output.replace(client.config.secretKey, "[REDACTED]")
		}
		let embedEval = new MessageEmbed()
			.setColor(client.config.embedColor)
			.addField(':inbox_tray: Input:', `\`\`\`js\n${beautify(code)}\n\`\`\``, false)
			.addField(':outbox_tray: Output:', `\`\`\`js\n${output}\n\`\`\``, false)
			.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
      	message.channel.send(embedEval);
	}).catch((err) => {
		err = err.toString()
		if (err.includes(client.config.token)) {
			err = err.replace(client.config.token, "[REDACTED]")
		}
		if (err.includes(client.config.webhookBanToken)) {
			err = err.replace(client.config.webhookBanToken, "[REDACTED]")
		}
		if (err.includes(client.config.secretKey)) {
			err = err.replace(client.config.secretKey, "[REDACTED]")
		}
		let embedEvalErr = new MessageEmbed()
			.setColor(client.config.embedColor)
			.addField(':inbox_tray: Input:', `\`\`\`js\n${beautify(code)}\n\`\`\``, false)
			.addField(':outbox_tray: Output:', `\`\`\`js\n${output}\n\`\`\``, false)
			.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
      	message.channel.send(embedEvalErr);
	})
}



module.exports.data = {
	name: "lzeval",
	permissions: ["developer"],
	type: "message"
}