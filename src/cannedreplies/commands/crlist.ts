import { MessageEmbed } from 'discord.js';
import { EMBED_INFO_COLOR, registerCommand } from '../../utils';
import { cannedReplies } from '../listener';

registerCommand('crlist', [], message => {
    let fields: string[][] = [];
    let replies = cannedReplies[message.guildId];

    for (const [name, reply] of Object.entries(replies)) {
        let flags = [];
        if (reply.locked) {
            flags.push('Locked');
        }
        
        if (reply.value.startsWith('@')) {
            flags.push('Alias(' + reply.value + ')');
        }

        if (reply.hasOwnProperty('url')) {
            flags.push('Embed');
        }

        fields.push([ `=${name}`, reply.author, flags.join(', ') || '⠀' ])
    }

    const embed = new MessageEmbed()
        .setColor(EMBED_INFO_COLOR);

    if (fields.length === 0) {
        embed.setDescription(`There are no canned repleis events in this server. You can create a canned reply using the \`=\` command.`);
    } else {
        embed.setDescription(`All canned replies in this server:`)
            .addFields([ 
                { name: 'Name', value: fields.map(x => x[0]).join('\n'), inline: true },
                { name: 'Author', value: fields.map(x => x[1]).join('\n'), inline: true },
                { name: 'Flags', value: fields.map(x => x[2]).join('\n'), inline: true },
            ]);
    }

    message.reply({ allowedMentions: { repliedUser: false }, embeds: [embed] });
});