const { MessageEmbed, Client, Collection, Intents } = require('discord.js');
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
        this.utils = require('./utils/utils')
        this.queue = new Map();
        this.json = {
            badges: this.badges = require(`${this.config.jsonPath}badges.json`),
            stats: this.stats = require(`${this.config.jsonPath}stats.json`),
            exchange: this.exchange = require(`${this.config.jsonPath}exchange.json`),
            shop: this.shop = require(`${this.config.jsonPath}shop.json`)
        }
    };
    async saveJSON (name, db) {
        fs.writeFileSync(`${this.config.jsonPath}${name}.json`, JSON.stringify(db, null, "\t"));
    }
    randInt (min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

    async LazyLoader () {
        const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js')); // чтение папки events
        this.logger.log(`[!] DISCORD EVENTS`, "log")
        for (const file of eventFiles) {
            const event = require(`./events/${file}`);
            let eventName = file.split(".")[0];
            this.logger.log(`[!] Загружено событие ${file}`, "log")
            this.on(eventName, event.bind(null, this));
            delete require.cache[require.resolve(`./events/${file}`)];
        };
        this.logger.log(`[!] COMMANDS`, "log")
        fs.readdirSync("./commands/").forEach(dirs => {
            const allCommands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));
            for (const file of allCommands) {
                let command = require(`./commands/${dirs}/${file}`);
                this.logger.log(`[!] Загружена команда ${file}`, "log")
                this.commands.set(command.data.name, command);
                command.data.permissions.forEach(permission => {
                    this.permissions.set(permission, command.data.name)
                });
            };
        });
        this.login(this.config.token);
    };
}