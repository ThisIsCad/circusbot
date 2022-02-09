import { eventCreationHandler } from './events/creator';
import { threadCreationHandler } from './threads/thread_creator';
import { registerEventReactions } from './events/reaction_signups';
import { antispamHandler } from './misc/antispam';
import { easterEggHandler } from './misc/easter_eggs';
import { isValidCommand, runCommand, log } from './utils';
import { client } from './client';
import { DMChannel } from 'discord.js';
import config from '../config.json';

import './events/commands';
import './threads/commands';
import './misc/commands';

client.on('ready', () => {
  log('info', `Logged in as ${client?.user?.tag}!`);
});

client.on('messageCreate', async (message) => {
    // Ignore messages written by other bots
    if (message.author.bot) {
        return;
    }

    // If it's a registered command, call the command handler
    if (isValidCommand(message.content)) {
        runCommand(message);
        return;
    }

    // Check if it's a DM
    if (message.channel instanceof DMChannel) {
        log('info', `New DM from ${message.author.tag}: ${message.content}`);
        return;
    }

    // If the message isn't a registered command, delegate to the event/thread creation wizards
    // in case we are in the process of creating an event/thread.
    eventCreationHandler(message);
    threadCreationHandler(message);
    antispamHandler(message);
    easterEggHandler(message);
});

registerEventReactions(client);

process.on('unhandledRejection', error => {
    console.error('Unhandled rejection: ', error);
});

client.login(config.BOT_TOKEN);
