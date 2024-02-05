import Event from '../structures/Event.js';
import Messages from '../models/MessagesModel.js';
import { format } from '../lib/Utils.js'
import { GuildMember, PermissionsBitField, TextChannel } from 'discord.js';
import Cache from '../lib/Cache.js';

// Функция форматирует строки в многоуровневом объекте по заданной функции
function formatObject(obj:any, f:(str:string)=>string):any {
    if (typeof obj == 'string') return f(obj)

    else if (Array.isArray(obj)) return obj.map(elm => formatObject(elm, f))

    else if (typeof obj == 'object') {
        for(let key in obj) obj[key] = formatObject(obj[key], f);

        return obj;
    }

    else return obj;
}

export default [
    class WelcomeListener extends Event {
        trigger = 'guildMemberAdd'

        async exec(member:GuildMember) {
            let settings = await Messages.findOne({type: 'Welcome', guildID: member.guild.id}).exec();

            if(!settings || !settings.enabled || !settings.channelID || ( !settings.message?.content && !settings.message?.embeds.length )) return;

            let channel = member.guild.channels.cache.get(settings.channelID);
            let memberBot = member.guild.members.cache.get(Cache.client.user?.id!)!

            if(!channel || !(channel instanceof TextChannel) || !channel.permissionsFor(memberBot).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel])) return;

            channel.send(formatObject(settings.message, (str) => format(str, {
                USERNAME: member.user.username,
                MENTION: `<@!${member.id}>`,
                GUILDNAME: member.guild.name,
                COUNT: `${member.guild.members.cache.size}`
            })));
        }
    },

    class GoodbyeListener extends Event {
        trigger = 'guildMemberRemove';

        async exec(member:GuildMember) {
            let settings = await Messages.findOne({type: 'Goodbye', guildID: member.guild.id}).exec();

            if(!settings || !settings.enabled || !settings.channelID || ( !settings.message?.content && !settings.message?.embeds.length )) return;

            let channel = member.guild.channels.cache.get(settings.channelID);
            let memberBot = member.guild.members.cache.get(Cache.client.user?.id!)!

            if(!channel || !(channel instanceof TextChannel) || !channel.permissionsFor(memberBot).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel])) return;

            channel.send(formatObject(settings.message, (str) => format(str, {
                USERNAME: member.user.username,
                GUILDNAME: member.guild.name,
                COUNT: `${member.guild.members.cache.size}`
            })));
        }
    }
]