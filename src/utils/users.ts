import { Guild, GuildMember, User } from 'discord.js';
import { closestMatch, distance } from 'closest-match';

let guildCacheFetched: string[] = [];

export async function getGuildMember(user: User, guild: Guild) {
    if (!guild) return null;

    return await guild.members.fetch(user.id);
}

export async function getDisplayName(user: User, guild: Guild | null) {
    if (!guild) return user.tag;

    return (await guild.members.fetch(user.id))?.displayName || user.tag;
}

export async function findMember(guild: Guild, search: string) {
    let members = (await findMembers(guild, search)).filter(x => x !== undefined);

    if (members.length === 0 || members.length > 1) {
        return null
    } else {
        return members[0] as GuildMember;
    }
}

export async function findMembers(guild: Guild, search: string) {
    let member: GuildMember | undefined, members: GuildMember[];
    search = search.toLowerCase();

    // Fetch all members in the server if we haven't done so since starting up
    if (!guildCacheFetched.includes(guild.id)) {
        await guild.members.fetch();
        guildCacheFetched.push(guild.id);
    }

    // User mention, e.g. <@200716538729201664>
    if (search.match(/<@!?(\d+)>/)) {
        return [guild.members.cache.find(x => x.user.id === search.replace(/[<>@!]/g, ''))];
    }

    // User tag, e.g. Cad#1234
    if (search.match(/^@?(.*?#[0-9]{4})$/)) {
        const userTag = search.replace(/^@/, '');
        member = guild.members.cache.find(x => x.user.tag.toLowerCase() === userTag);
        return member ? [member] : [];
    }

    // Easter eggs
    if (search === 'toxye') {
        member = guild.members.cache.find(x => x.user.id === '407051988551991307');
        if (member) return [member];
    } else if (search === 'god') {
        member = guild.members.cache.find(x => x.user.id === '261966268964274176');
        if (member) return [member];
    } else if (search === 'guild master' || search === 'gm' || search === 'guildmaster') {
        member = guild.members.cache.find(x => x.user.id === '392916814742552586');
        if (member) return [member];
    }

    // Search by username for an exact match
    member = guild.members.cache.find(x => x.user.username.toLowerCase() === search);
    if (member) return [member];

    // Search by display name for an exact match
    member = guild.members.cache.find(x => x.displayName.toLowerCase() === search);
    if (member) return [member];

    // Search by username for an incomplete match
    members = Array.from(guild.members.cache.filter(x => x.user.username.toLowerCase().includes(search)).values());
    if (members.length >= 1) return members;

    // Search by display name for an incomplete match
    members = Array.from(guild.members.cache.filter(x => x.displayName.toLowerCase().includes(search)).values());
    if (members.length >= 1) return members;

    // Search using Levenshtein distance
    let usersByUsername = Array.from(guild.members.cache.values()).map(x => x.user.username.toLowerCase());
    let usersByNickname = Array.from(guild.members.cache.values()).map(x => x.nickname?.toLowerCase() || x.user.username.toLowerCase());
    let closestUsername = closestMatch(search, usersByUsername) as string;
    let closestNickname = closestMatch(search, usersByNickname) as string;

    if (distance(search, closestUsername) <= 2) {
        return [guild.members.cache.find(x => x.user.username.toLowerCase() === closestUsername)];
    } else if (distance(search, closestNickname) <= 2) {
        return [guild.members.cache.find(x => (x.nickname?.toLowerCase() || x.user.username.toLowerCase()) === closestNickname)];
    }

    return [
        guild.members.cache.find(x => x.user.username.toLowerCase() === closestUsername),
        guild.members.cache.find(x => (x.nickname?.toLowerCase() || x.user.username.toLowerCase()) === closestNickname)
    ];
}