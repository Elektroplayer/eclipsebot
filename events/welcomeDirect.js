const WelcomeDirect = require('../models/welcomeDirect');
// eslint-disable-next-line no-unused-vars
const Client  = require('../lib/client.js'), { GuildMember } = require('discord.js');

module.exports = {
    name: "guildMemberAdd",

    /**
     * @param {Client} bot
     * @param {GuildMember} member
     */
    run: async function (bot, member) {
        WelcomeDirect.findOne({guildID:member.guild.id}, (err,set) => {
            if(err) console.log(err);

            if(!set) return;
            if(!set.message) return;

            let clearMessage = `${set.message}`
            .replace(/{{USERNAME}}/g, member.user.username)
            .replace(/{{MENTION}}/g, `<@!${member.id}>`)
            .replace(/{{TAG}}/g, `${member.user.tag}`)
            .replace(/{{GUILDNAME}}/g, `${member.guild.name}`)
            .replace(/{{COUNT}}/g, `${member.guild.members.cache.size}`)

            let message = !set.embed ? clearMessage : {embed: JSON.parse(`${clearMessage}`).obj[0], disableMentions: "all"};

            member.send(message).catch(() => ' ');
        })
    }
}