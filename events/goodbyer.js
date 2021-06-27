const Goodbye = require('../models/goodbye.js');
// eslint-disable-next-line no-unused-vars
const Client  = require('../lib/client.js'), { GuildMember } = require('discord.js');
const ERRORS  = require('../')

module.exports = {
    name: "guildMemberRemove",

    /**
     * @param {Client} bot
     * @param {GuildMember} member
     */
    run: async function (bot, member) {
        Goodbye.findOne({guildID:member.guild.id}, (err,set) => {
            if(err) console.log(err);

            if(!set) return;
            if(!set.channelID || !set.message) return;

            let channel = member.guild.channels.cache.get(set.channelID)

            if(!channel) return ERRORS.custom({channel: member.guild.owner}, `Ошибка при поиске канала \`${set.channelID}\``);
            if(!channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return ERRORS.custom({channel: member.guild.owner}, `Нету права для отправки сообщения в канал \`${set.channelID}\``);
            if(set.embed && (!member.guild.me.permissions.has("EMBED_LINKS") || !channel.permissionsFor(bot.user).has("EMBED_LINKS"))) return ERRORS.custom({channel: member.guild.owner}, `Нету права для отправки embed-сообщения в канал \`${set.channelID}\``);

            let clearMessage = `${set.message}`
            .replace(/{{USERNAME}}/g, member.user.username)
            //.replace(/{{MENTION}}/g, `<@!${member.id}>`) //  Он не будет работать или будет, но через одно место
            .replace(/{{TAG}}/g, `${member.user.tag}`)
            .replace(/{{GUILDNAME}}/g, `${member.guild.name}`)
            .replace(/{{COUNT}}/g, `${member.guild.members.cache.size}`)

            let message = !set.embed ? clearMessage : {embed: JSON.parse(`${clearMessage}`).obj[0], disableMentions: "all"};

            channel.send(message);
        })
    }
}