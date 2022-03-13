const beautify = require('js-beautify').js;
const Command = require('../../class/Command')
class Lzeval extends Command {
	constructor(client) {
		super(client, {
			name: 'lzeval',
			permissions: ['developer'],
			type: 'message',
			enabled: true,
			guildOnly: false
		})
	}

	async run (client, message, args) {
		if(message.author.id != '561822820632494081')
		return;
		const code = args.join(" ");
		const result = new Promise((resolve) => resolve(eval(code)));
		return result.then((output) => {
			if (typeof output !== "string") {
				output = require('util').inspect(output, { depth: 0 });
			}
			output.replaceAll(client.config.token, "[REDACTED]")
			output.replaceAll(client.config.webhookBan.id, "[REDACTED]")
			output.replaceAll(client.config.webhookBan.token, "[REDACTED]")
			output.replaceAll(client.config.secretKey, "[REDACTED]")
			if (output.length > (1024 - (message.content.length))) {
				client.logger.log(`Evaluated code via /lzeval`, 'debug')
				return console.log(output)
			}
			let embedEval = client.utils.embed(undefined, undefined, message.author)
				.addField(':inbox_tray: Input:', `\`\`\`js\n${beautify(code)}\n\`\`\``, false)
				.addField(':outbox_tray: Output:', `\`\`\`js\n${output}\n\`\`\``, false)
			message.channel.send({embeds: [embedEval]});
		}).catch((err) => {
			err = err.toString()
			if (err.includes(client.config.token)) {
				err.replaceAll(client.config.token, "[REDACTED]")
			}
			if (err.includes(client.config.webhookBanToken)) {
				err.replaceAll(client.config.webhookBanToken, "[REDACTED]")
			}
			if (err.includes(client.config.secretKey)) {
				err.replaceAll(client.config.secretKey, "[REDACTED]")
			}
			if (err.length > (1024 - (message.content.length))) {
				client.logger.log(`Evaluated code via /lzeval`, 'debug')
				client.logger.log(`Error!`, 'err')
				return console.error(output)
			}
			let embedEvalErr = client.utils.embed(undefined, undefined, message.author)
				.addField(':inbox_tray: Input:', `\`\`\`js\n${beautify(code)}\n\`\`\``, false)
				.addField(':outbox_tray: Output:', `\`\`\`js\n${err}\n\`\`\``, false)
			message.channel.send({embeds: [embedEvalErr]});
		})
	}
}

module.exports = Lzeval;
