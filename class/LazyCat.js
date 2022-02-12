const { Client, Collection, Intents } = require('discord.js');
const { Player } = require('discord-player');
class LazyCat extends Client {
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES
            ]
        });
        this.player = new Player(this, {
			leaveOnEmpty: false,
			enableLive: true
		});
        this.config = require('./config');
        this.commands = new Collection();
        this.logger = require('./utils/logger');
        this.db = require('./utils/db');
        this.emoji = require('./emojis');
        this.messages = require('./messages');
        this.queue = new Map();
        this.stats = require(`${client.config.jsonPath}stats.json`);
        this.exchange = require(`${client.config.jsonPath}exchange.json`);
        this.shop = require(`${client.config.jsonPath}shop.json`);
    };
    saveJSON (name) {
        nameFile = () => Object.keys({ name })[0];
        fs.writeFileSync(`${this.config.jsonPath}${name}.json`, JSON.stringify(name, null, "\t"));
    }
    randInt(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }
}