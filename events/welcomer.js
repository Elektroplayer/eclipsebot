const Welcome = require('../models/welcome.js');
// eslint-disable-next-line no-unused-vars
const Client  = require('../lib/client.js'), { GuildMember } = require('discord.js');

module.exports = {
    name: "guildMemberAdd",

    /**
     * @param {Client} bot
     * @param {GuildMember} member
     */
    run: async function (bot, member) {
        Welcome.findOne({guildID:member.guild.id}, (err,set) => {
            if(err) console.log(err);

            if(!set) return;
            if(!set.channelID || !set.message) return;

            let channel = member.guild.channels.cache.get(set.channelID)

            if(!channel) return; //  Тут должна быть ошибка
            if(!channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return; //  Тут тоже
            if(set.embed && (!member.guild.me.permissions.has("EMBED_LINKS") || !channel.permissionsFor(bot.user).has("EMBED_LINKS"))) return; //  И тут

            let clearMessage = `${set.message}`
            .replace(/{{USERNAME}}/g, member.user.username)
            .replace(/{{MENTION}}/g, `<@!${member.id}>`)
            .replace(/{{TAG}}/g, `${member.user.tag}`)
            .replace(/{{GUILDNAME}}/g, `${member.guild.name}`)
            .replace(/{{COUNT}}/g, `${member.guild.members.cache.size}`)

            let message = !set.embed ? clearMessage : {embed: JSON.parse(`{"obj":[${clearMessage}]}`).obj[0], disableMentions: "all"};

            channel.send(message);
        })
    }
}