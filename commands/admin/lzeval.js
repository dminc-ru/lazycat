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
		output.replace(client.config.token, "[REDACTED]")
		output.replace(client.config.webhookBan.id, "[REDACTED]")
		output.replace(client.config.webhookBan.token, "[REDACTED]")
		output.replace(client.config.secretKey, "[REDACTED]")
		if (output.length > (1024 - (message.content.length))) {
			client.logger.log(`Evaluated code via /lzeval`, 'debug')
			return console.log(output)
		}
		let embedEval = new MessageEmbed()
			.setColor(client.config.embedColor)
			.addField(':inbox_tray: Input:', `\`\`\`js\n${beautify(code)}\n\`\`\``, false)
			.addField(':outbox_tray: Output:', `\`\`\`js\n${output}\n\`\`\``, false)
			.setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
      	message.channel.send({embeds: [embedEval]});
	}).catch((err) => {
		err = err.toString()
		if (err.includes(client.config.token)) {
			err.replace(client.config.token, "[REDACTED]")
		}
		if (err.includes(client.config.webhookBanToken)) {
			err.replace(client.config.webhookBanToken, "[REDACTED]")
		}
		if (err.includes(client.config.secretKey)) {
			err.replace(client.config.secretKey, "[REDACTED]")
		}
		if (err.length > (1024 - (message.content.length))) {
			client.logger.log(`Evaluated code via /lzeval`, 'debug')
			client.logger.log(`Error!`, 'err')
			return console.error(output)
		}
		let embedEvalErr = new MessageEmbed()
			.setColor(client.config.embedColor)
			.addField(':inbox_tray: Input:', `\`\`\`js\n${beautify(code)}\n\`\`\``, false)
			.addField(':outbox_tray: Output:', `\`\`\`js\n${err}\n\`\`\``, false)
			.setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
      	message.channel.send({embeds: [embedEvalErr]});
	})
}



module.exports.data = {
	name: "lzeval",
	permissions: ["developer"],
	type: "message"
}