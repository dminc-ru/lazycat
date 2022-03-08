const { MessageEmbed, Client, Collection, Intents } = require('discord.js');
const { Player } = require('discord-player');
let fs = require('fs');
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
            bans: this.bans = require(`${this.config.jsonPath}bans.json`),
            cases: this.cases = require(`${this.config.jsonPath}cases.json`),
            config: this.config = require(`${this.config.jsonPath}config.json`),
            daystrike: this.daystrike = require(`${this.config.jsonPath}daystrike.json`),
            exchange: this.exchange = require(`${this.config.jsonPath}exchange.json`),
            inventory: this.inventory = require(`${this.config.jsonPath}inventory.json`),
            items: this.items = require(`${this.config.jsonPath}items.json`),
            levels: this.items = require(`${this.config.jsonPath}levels.json`),
            messages: this.items = require(`${this.config.jsonPath}messages.json`),
            mutes: this.items = require(`${this.config.jsonPath}mutes.json`),
            playlists: this.items = require(`${this.config.jsonPath}playlists.json`),
            stats: this.stats = require(`${this.config.jsonPath}stats.json`),
            shop: this.shop = require(`${this.config.jsonPath}shop.json`),
            weekstrike: this.weekstrike = require(`${this.config.jsonPath}weekstrike.json`),
            works: this.works = require(`${this.config.jsonPath}works.json`)
        }
    };
    async saveJSON (name, db) {
        fs.writeFileSync(`${this.config.jsonPath}${name}.json`, JSON.stringify(db, null, "\t"));
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
    declOfNum(n, text_forms) {  
        n = Math.abs(n) % 100; var n1 = n % 10;
        if (n > 10 && n < 20) { return text_forms[2]; }
        if (n1 > 1 && n1 < 5) { return text_forms[1]; }
        if (n1 == 1) { return text_forms[0]; }
        return text_forms[2];
    }
}