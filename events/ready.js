module.exports = (client) => {
	client.logger.log(`[!] Logged in as ${client.user.tag}`, "log");
	client.user.setActivity(`/помощь`, { type: "LISTENING" });
};