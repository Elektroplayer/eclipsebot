const PrivateVoices = require('../models/privateVoices.js');
// eslint-disable-next-line no-unused-vars
const discord = require('discord.js'), Client = require('../lib/client.js');

module.exports = {
    name: "voiceStateUpdate",
    /**
     * 
     * @param {Client} client 
     * @param {discord.VoiceState} oldState 
     * @param {discord.VoiceState} newState 
     */
    run: async function(bot, oldState, newState) {
        
        if (!oldState.guild.me.permissions.has(["MANAGE_CHANNELS","MOVE_MEMBERS"])) return;

        let enterType
        if(!!newState.channelID && !oldState.channelID) enterType = 'вошёл'
        if(!newState.channelID && !!oldState.channelID) enterType = 'вышел'
        if(!!newState.channelID && !!oldState.channelID) enterType = 'перешёл'

        if(enterType == 'вошёл') {
            let channel = newState.channel;
            let member  = channel.guild.members.cache.get(newState.id);

            PrivateVoices.findOne({guildID:channel.guild.id, channelID: channel.id}, async (err,set) => {
                if(err) console.log(err);

                if(!set) return;
                if(!channel.parentID) return;

                let name = `${set.template.replace('{{USERNAME}}', member.user.username )
                .replace('{{NICKNAME}}', member.nickname || member.user.username )
                .replace('{{TAG}}', member.user.tag)}`;
                
                let newChannel = await channel.guild.channels.create(name, {
                    permissionOverwrites: [
                        {
                            id: newState.member.id,
                            allow: ["MANAGE_CHANNELS", "MOVE_MEMBERS"],
                        }
                    ],
                    type: "voice",
                    parent: channel.parentID
                }).catch(() => {return})

                member.voice.setChannel(newChannel);
            });
        }

        if(enterType == 'вышел') {
            let channel = oldState.channel;

            PrivateVoices.find({guildID:channel.guild.id}, async (err,set) => {
                if(
                    set.filter(c => 
                        channel.guild.channels.cache.get(c.channelID) &&
                        channel.guild.channels.cache.get(c.channelID).parentID == channel.parentID && 
                        channel.id !== c.channelID
                    ).length !== 0 &&
                    channel.members.size == 0
                ) {
                    channel.delete().catch(() => {return});
                }
            })
        }

        if(enterType == 'перешёл') {
            let oldChannel = oldState.channel;
            let newChannel = newState.channel;
            let member     = newChannel.guild.members.cache.get(newState.id);

            PrivateVoices.find({guildID:oldChannel.guild.id}, async (err,set) => {
                if(
                    set.filter(c => 
                        oldChannel.guild.channels.cache.get(c.channelID) &&
                        oldChannel.guild.channels.cache.get(c.channelID).parentID == oldChannel.parentID && 
                        oldChannel.id !== c.channelID
                    ).length !== 0 &&
                    oldChannel.members.size == 0
                ) {
                    oldChannel.delete().catch(() => {return});
                }
            })

            PrivateVoices.findOne({guildID:newChannel.guild.id, channelID: newChannel.id}, async (err,set) => {
                if(err) console.log(err);

                if(!set) return;
                if(!newChannel.parentID) return;

                let name = `${set.template.replace('{{USERNAME}}', member.user.username )
                .replace('{{NICKNAME}}', member.nickname || member.user.username )
                .replace('{{TAG}}', member.user.tag)}`;
                
                let CreateNewChannel = await newChannel.guild.channels.create(name, {
                    permissionOverwrites: [
                        {
                            id: newState.member.id,
                            allow: ["MANAGE_CHANNELS", "MOVE_MEMBERS"],
                        }
                    ],
                    type: "voice",
                    parent: newChannel.parentID
                }).catch(() => {return})

                member.voice.setChannel(CreateNewChannel);
            });
        }
    }   
}