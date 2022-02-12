import { MessageEmbed, Client, Collection, Intents } from 'discord.js';
import { Player } from 'discord-player';
import util from 'util';
import path from 'path';
import moment from 'moment';

class LazyCat extends Client {
    config: any
    constructor () {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES, 
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES
            ]
        });
        this.config = require('./config');
    }
}