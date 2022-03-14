import { MessageEmbed } from 'discord.js';
import { registerCommand, checkPermissions, sendReply, EMBED_INFO_COLOR, EMBED_ERROR_COLOR } from '../../utils';

registerCommand('help', [], async interaction => {
    let helpMsg = 'I can do a lot of different things <:potatoAngel:925130155507191948>. Here is a list of the commands that you have permission to run in the current channel.\n\n';

    if (checkPermissions('configure', interaction.channel)) {
        helpMsg += "⚙️ `configure`\nThe configuration command allows you to tweak the settings and options for other modules, such as enabled/disabling the welcome module, sniping, canned replies, and more. For more information about the available options, type `!configure`.\n\n";
    }
    if (checkPermissions('event_help', interaction.channel)) {
        helpMsg += "🗓️ `events`\nThe events module is used to create event sign-up sheets, where users can sign-up as specific roles using reactions. This module has many commands available, type `!events` for more information on how to get started.\n\n";
    }
    if (checkPermissions('threads', interaction.channel)) {
        helpMsg += "🧵 `threads`\nThe threads module is used to create threads that get created/archived on a recurring basis (not based on user activity). For example, a weekly discussion thread. This module has many commands available, type `!threads` for more information on how to get started.\n\n";
    }
    if (checkPermissions('remind_me', interaction.channel)) {
        helpMsg += "⏲️ `remindme`\nCreate a reminder for yourself to go off in the specified time. The reminder message is optional, and if not specified, a random message will be provided instead. The command can also take a time (e.g. 6:00 PM), but not a date.\n**Example:** `!remindme 1h Do Something`\n\n";
    }
    if (checkPermissions('8ball', interaction.channel)) {
        helpMsg += "❓ `8ball`\nAsk the magic 8-ball a yes/no question, and receive a response from the beyond.\n**Example:** `!8ball Is CirqueBot the best bot?`\n\n";
    }
    if (checkPermissions('nroll', interaction.channel)) {
        helpMsg += "🎲 `roll`\nRoll a random number. Useful if you are indecisive, or just want to fairly select an option. Can take a range to roll (min & max, or just max). Default minimum value is 1.\n**Example:** `!roll 5 20`\n\n";
    }

    helpMsg += "🗒️ `=`\nCanned Messages allow you to create an interactive Discord 'wiki' of sorts, where users can create a named message with an assigned value, and users can re-post the assigned value using just the name in any channel. For more information, type `=help`.\n**Example:** `=parse=Here is our StarParse information`\n\n";
    helpMsg += "<:worrySnipe:953042402074050560> `pls snipe`\nThis infamous command allows you to 'snipe' a deleted message posted within the configured time limit. CirqueBot will repost the message & author of the deleted message. Please use responsibly.\n\n";
    helpMsg += "<:worrySnipe:953042402074050560> `pls esnipe`\nThis slightly less infamous command allows you to 'snipe' an edited message posted within the configured time limit. CirqueBot will repost the original message & author of the edited message. Please use responsibly.\n\n";
    helpMsg += "<:worrySnipe:953042402074050560> `pls rsnipe`\nThis completely obscure command allows you to 'snipe' a reaction that was removed from a message within the configured time limit. CirqueBot will repost the original reaction & author. Please use irresponsibly.\n\n";

    if (!helpMsg) {
        sendReply(interaction, EMBED_ERROR_COLOR, "There are no commands whitelisted for this channel");
        return;
    }   
    
    const embed = new MessageEmbed().setTitle('CirqueBot Help: ​ ​ `!help`').setDescription(helpMsg)
    sendReply(interaction, EMBED_INFO_COLOR, embed);
});
