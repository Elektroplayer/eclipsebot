import Listener from '../structures/Listener.js'
// eslint-disable-next-line no-unused-vars
import discord from 'discord.js'
import PrivateVoices from '../models/PrivateVoices.js'
import { format } from '../structures/Utils.js'

export default class ReadyListener extends Listener {
    event = 'voiceStateUpdate'

    /**
    * @param {discord.VoiceState} oldState
    * @param {discord.VoiceState} newState
    */
    async exec(oldState, newState) {
        if (!newState.guild.me.permissions.has(['MANAGE_CHANNELS', 'MOVE_MEMBERS'])) return

        if(oldState.channelId && (oldState.channel || oldState.guild.channels.cache.get(oldState.channelId))) {
            let channel = oldState.channel || oldState.guild.channels.cache.get(oldState.channelId)

            if(!channel) return //console.log(oldState);

            let settings = await PrivateVoices.find({guildID: channel.guild.id}).exec()
            // Смотрим есть ли наш канал в категории приватных войсов
            settings = settings.filter(c =>
                channel.guild.channels.cache.get(c.channelID) &&
                channel.guild.channels.cache.get(c.channelID).parentId == channel.parentId &&
                channel.id !== c.channelID
            )

            // Если да и участников в этом канале нет, то мы его удаляем
            if (settings.length && !channel.members.size)
                await channel.delete()
        }

        if(newState.channelId) {
            let channel = newState.channel || newState.guild.channels.cache.get(newState.channelId)

            if(!channel) return //console.log(oldState)

            let member  = channel.guild.members.cache.get(newState.id)
            let settings = await PrivateVoices.findOne({guildID:channel.guild.id, channelID: channel.id}).exec()

            if(!settings || !channel.parentId) return

            const name = format(settings.template,
                {
                    USERNAME: member.user.username,
                    NICKNAME: member.nickname || member.user.username,
                    TAG: member.user.tag
                }
            )

            const newChannel = await channel.guild.channels.create(name, {
                permissionOverwrites: [
                    {
                        id: newState.member.id,
                        allow: ['MANAGE_CHANNELS', 'MOVE_MEMBERS'],
                    }
                ],
                type: 'GUILD_VOICE',
                parent: channel.parentId
            })

            await member.voice.setChannel(newChannel)
        }
    }
}
