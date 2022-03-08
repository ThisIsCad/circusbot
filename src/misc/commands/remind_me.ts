import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { client } from '../../client';
import { registerCommand, parseCommand, sendReply, EMBED_ERROR_COLOR, loadPersistentData, log, getFormattedDate, savePersistentData, EMBED_DMM_COLOR, makeError, arrayRandom } from '../../utils';

let reminders = loadPersistentData('reminders', []);

const RANDOM_REASONS = [
    'Maybe you left the fridge running?',
    'Maybe you forgot to turn off your oven?',
    'Maybe you have a raid?',
    'Maybe it\'s time to take a break?',
    'Maybe it\'s time to let the dogs out?',
    'Maybe it\'s time to feed your pet fish?',
    'Maybe it\'s time to water the lawn?',
    'Maybe it\'s time to drink some more water?',
    'Maybe it\'s time to check the oven',
    'Maybe it\'s time to get some more coffee?',
    'Maybe it\'s time to go outside for some fresh air?',
    'Maybe it\'s time to walk the dogs?',
    'Maybe it\'s time to take your vitamins?',
    'Maybe it\'s time to send that email?',
];

client.on('ready', () => {
    reminders.forEach(reminder => scheduleReminder(reminder));
});

function scheduleReminder(reminder: any) {
    log('info', `${reminder.remindedBy} has set a reminder for ${reminder.remindee} at ${reminder.remindAt}`);

    setTimeout(async () => {
        const channel = await client.channels.fetch(reminder.channel) as TextChannel;
        const description = reminder.reminder ? reminder.reminder : `No reminder reason was specified. ${arrayRandom(RANDOM_REASONS)}`;
        const embed = new MessageEmbed()
            .setColor(EMBED_DMM_COLOR)
            .setDescription(`${description}\n\nI hope I\'ve jogged your memory <:potatoAngel:925130155507191948>`)
            .setFooter({ text: '⏲️ To schedule a reminder, use the !remindme command' });
        const content = `<@${reminder.remindee}> ${reminder.remindedBy === reminder.remindee ? 'You' : reminder.remindedByTag} asked me to remind you at this time with the following message:`;

        channel.send({ content, embeds: [embed] })

        reminders = reminders.filter(x => x.id !== reminder.id);
        savePersistentData('reminders', reminders);
    }, Date.parse(reminder.remindAt) - Date.now());
}

registerCommand('remind_me', ['remindme', 'remind'], message => {
    if (!(message instanceof Message)) return;

    let [user, remindTime, remindUnit, reminder] = parseCommand(message, /(<.*?> )?(([0-9]+) ?(?:s|seconds?|m|minutes?|h|hours?|d|days?|w|weeks?|m|months?)|[0-9]{1,2}:[0-9]{2} ?(?:AM|PM))(.*)/i);
    
    let remindee = user ? message.mentions.users.first() : message.author;

    if (!remindee || !remindTime) {
        sendReply(message, EMBED_ERROR_COLOR, makeError('Incorrect usage. Please specify a time and reason for the reminder, for example:\n\n```\n!remindme 3 hours Login for raid\n```\n'));
        return;
    }

    let remindAt = new Date();

    if (remindTime.includes('second') || remindTime.match(/[0-9] ?s$/)) {
        remindAt.setSeconds(remindAt.getSeconds() + parseInt(remindUnit));
    } else if (remindTime.includes('minute') || remindTime.match(/[0-9] ?m$/)) {
        remindAt.setMinutes(remindAt.getMinutes() + parseInt(remindUnit));
    } else if (remindTime.includes('hour') || remindTime.match(/[0-9] ?h$/)) {
        remindAt.setHours(remindAt.getHours() + parseInt(remindUnit));
    } else if (remindTime.includes('day') || remindTime.match(/[0-9] ?d$/)) {
        remindAt.setHours(remindAt.getHours() + parseInt(remindUnit) * 24);
    } else if (remindTime.includes('week') || remindTime.match(/[0-9] ?w$/)) {
        remindAt.setHours(remindAt.getHours() + parseInt(remindUnit) * 24 * 7);
    } else if (remindTime.includes('month') || remindTime.match(/[0-9] ?m$/)) {
        remindAt.setMonth(remindAt.getMonth() + parseInt(remindUnit));
    } else {
        let scheduledTime = remindAt.getFullYear() + "-" + ('0' + (remindAt.getMonth() + 1)).slice(-2) + "-" + ('0' + remindAt.getDate()).slice(-2) + ' ' + remindTime + ' EST';
        remindAt = new Date(scheduledTime);
    }
    
    let newReminder = {
        id: message.id,
        channel: message.channel.id,
        remindedBy: message.author.id,
        remindedByTag: message.author.tag,
        remindee: remindee.id,
        remindAt: getFormattedDate(remindAt),
        reminder: reminder,
    };

    reminders.push(newReminder)
    savePersistentData('reminders', reminders);
    scheduleReminder(newReminder);

    message.react('👍');
});
