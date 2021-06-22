const PrivateVoices = require('../models/privateVoices.js');
// eslint-disable-next-line no-unused-vars
const discord = require('discord.js'), Client = require('../lib/client.js');
const { format } = require('../lib/utils.js');

module.exports = {
    name: "voiceStateUpdate",
    /**
     * 
     * @param {Client} client 
     * @param {discord.VoiceState} oldState 
     * @param {discord.VoiceState} newState 
     */
    run: async function(bot, oldState, newState) {
        if (!oldState.guild.me.permissions.has(["MANAGE_CHANNELS", "MOVE_MEMBERS"])) return;

        if(oldState.channelID) {
            let channel = oldState.channel;

            // Появляется странная ошибка "TypeError: Cannot read property 'guild' of null", поэтому лучше пускай тут будет это условие
            if(!channel) return console.log(oldState);

            var settings = await PrivateVoices.find({guildID: channel.guild.id}).exec();
            // Смотрим есть ли наш канал в категории приватных войсов
            settings = settings.filter(c => 
                channel.guild.channels.cache.get(c.channelID) &&
                channel.guild.channels.cache.get(c.channelID).parentID == channel.parentID && 
                channel.id !== c.channelID
            )
            // Если да и участников в этом канале нет, то мы его удаляем
            if (settings.length && !channel.members.size)
                await channel.delete();
        }

        if(newState.channelID) {
            let channel = newState.channel;
            let member  = channel.guild.members.cache.get(newState.id);

            const settings = await PrivateVoices.findOne({guildID:channel.guild.id, channelID: channel.id}).exec();

            if(!settings) return;
            if(!channel.parentID) return;

            const name = format(settings.template, 
                {
                    USERNAME: member.user.username,
                    NICKNAME: member.nickname || member.user.username,
                    TAG: member.user.tag
                }
            );

            const newChannel = await channel.guild.channels.create(name, {
                permissionOverwrites: [
                    {
                        id: newState.member.id,
                        allow: ["MANAGE_CHANNELS", "MOVE_MEMBERS"],
                    }
                ],
                type: "voice",
                parent: channel.parentID
            });

            member.voice.setChannel(newChannel);
        }
    }   
}