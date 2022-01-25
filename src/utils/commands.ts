import { Message, TextBasedChannel } from 'discord.js';
import config from '../../config.json';
import { sendError } from './embeds';
import { log } from './logging';

const commands: { [command: string]: (message: Message<boolean>) => any } = {};
const aliases: { [command: string]: string } = {};

function getCommand(message: string) {
    const cmd = message.toLowerCase().replace(config.BOT_PREFIX, '').split(' ')[0];

    if (aliases.hasOwnProperty(cmd)) {
        return aliases[cmd];
    } else {
        return cmd;
    }
}

export function registerCommand(command: string, cmdAliases: string[], callback: (message: Message<boolean>) => any) {
    commands[command] = callback;

    for (const alias of cmdAliases) {
        aliases[alias] = command;
    }

    return true;
}

export function isValidCommand(message: string) {
    if (!message.toLowerCase().startsWith(config.BOT_PREFIX)) {
        return false;
    }

    const cmd = getCommand(message);

    return commands.hasOwnProperty(cmd);
}

export function runCommand(message: Message<boolean>) {
    const cmd = getCommand(message.content);

    if (!checkPermissions(cmd, message.channel)) {
        log('warn', `User ${message.author.tag} tried to run !${cmd} in ${message.channel.id} but channel is not in the whitelist`);
        sendError(message.channel, "Sorry, but I can only run this command in whitelisted channels.");
    } else if (commands.hasOwnProperty(cmd)) {
        log('info', `User ${message.author.tag} ran !${cmd} in ${message.channel.id}`);
        commands[cmd](message);
    }
}

export function checkPermissions(command: string, channel: TextBasedChannel) {
    return config.PERMISSIONS.hasOwnProperty(channel.id) && (config.PERMISSIONS[channel.id].includes("*") || config.PERMISSIONS[channel.id].includes(command));
}