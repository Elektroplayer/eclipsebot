import { ChannelType, VoiceChannel, VoiceState, PermissionsBitField } from 'discord.js';
import Event from '../../../structures/Event.js';
import Cache from '../../../lib/Cache.js';
import PrivateVoices from '../models/PrivateVoicesModel.js';
import { format } from '../../../lib/Utils.js';

export default [
    // Обработка выхода из канала
    class PrivateVoicesExitEvent extends Event {
        trigger = 'voiceStateUpdate';

        async exec(oldState: VoiceState, newState: VoiceState) {
            let me = newState.guild.members.cache.get(Cache.client.user?.id!);

            if (!me || !me.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MoveMembers])) return;

            if (oldState.channelId && (oldState.channel || oldState.guild.channels.cache.get(oldState.channelId))) {
                let channel = oldState.channel ?? oldState.guild.channels.cache.get(oldState.channelId);
                let settings = await PrivateVoices.findOne({ guildID: channel?.guild.id }).exec();

                if (!channel || !settings || !(channel instanceof VoiceChannel)) return; //console.log(oldState);

                let createChannel = channel.guild.channels.cache.get(settings.channelid);

                if (!createChannel || channel.id == createChannel.id || channel.parentId !== createChannel.parentId) return;

                if (!channel.members.size) await channel.delete();
            }
        }
    },

    // Обработка входа в канал
    class PrivateVoicesEnterEvent extends Event {
        trigger = 'voiceStateUpdate';

        async exec(oldState: VoiceState, newState: VoiceState) {
            let me = newState.guild.members.cache.get(Cache.client.user?.id!);

            if (!me || !me.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MoveMembers])) return;

            if (newState.channelId && (newState.channel || newState.guild.channels.cache.get(newState.channelId))) {
                let channel = newState.channel ?? newState.guild.channels.cache.get(newState.channelId);

                if (!channel) return;

                let member = channel.guild.members.cache.get(newState.id);
                let settings = await PrivateVoices.findOne({ guildID: channel.guild.id }).exec();

                if (!settings || !member) return;

                let createChannel = channel.guild.channels.cache.get(settings.channelid);

                if (!createChannel || channel.id !== createChannel.id) return;

                let name = format(settings.template, {
                    USERNAME: member.user.username,
                    NICKNAME: member.nickname || member.user.username,
                });

                let newChannel = await channel.guild.channels.create({
                    name,
                    parent: channel.parentId,
                    type: ChannelType.GuildVoice,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MoveMembers],
                        },
                    ],
                });

                await member.voice.setChannel(newChannel);
            }
        }
    },
];
