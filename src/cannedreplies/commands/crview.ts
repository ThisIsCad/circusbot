import { MessageEmbed } from 'discord.js';
import { bot } from '../../bot';
import { EMBED_ERROR_COLOR, EMBED_INFO_COLOR, makeError, sendReply } from '../../utils';
import { cannedReplies, renderCannedReply } from '../listener';

bot.registerCommand('crview', [], message => {
    const [name] = bot.parseCommand(message, /=?(.*)/);
    const guildId = message.guildId || '*';

    if (!cannedReplies[guildId].hasOwnProperty(name)) {
        bot.replyTo(message, EMBED_ERROR_COLOR, makeError('No such canned reply'));
        return;
    }

    const embed = renderCannedReply(cannedReplies[guildId][name]);

    if (embed instanceof MessageEmbed) {
        embed.setFooter({ text: 'This message will be automatically updated when the canned reply is updated' });
    }

    bot.replyTo(message, EMBED_INFO_COLOR, embed);
});
