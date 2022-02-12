import { Client, Collection, Intents } from 'discord.js';
import { Player } from 'discord-player';
import { registerPlayerEvents } from './events';
import fs from 'fs';
import chalk from 'chalk';
console.log(chalk.hex("#B88FFF")(`[!] Загрузка файлов...`));
const client: any = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.player = new Player(client);

