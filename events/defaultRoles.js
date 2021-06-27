const DefaultRoles = require('../models/defaultRoles.js');
// eslint-disable-next-line no-unused-vars
const Client  = require('../lib/client.js'), { GuildMember } = require('discord.js');
const ERRORS = require('../lib/errors.js');

module.exports = {
    name: "guildMemberAdd",

    /**
     * @param {Client} bot
     * @param {GuildMember} member
     */
    run: async function (bot, member) {
        DefaultRoles.findOne({guildID:member.guild.id}, (err,set) => {
            if(err) console.log(err);

            if(!set) return;
            if(!set.memberRoles || set.memberRoles.length == 0) return;

            if (!member.guild.me.permissions.has('MANAGE_ROLES')) return;

            if (set.memberRoles.length == 1) {
                if(!member.guild.roles.cache.get(set.memberRoles[0])) {
                    set.memberRoles = [];
                    set.save().catch(err => console.log(err));
                    return;
                }
                member.roles.add(set.memberRoles);
            }
            else {

                set.memberRoles.forEach(elm => {
                    if(!member.guild.roles.cache.get(elm)) {
                        set.memberRoles.splice(set.memberRoles.indexOf(elm), 1);
                        set.save().catch(err => console.log(err));
                        return;
                    }
                    member.roles.add(elm).catch(() => 
                        ERRORS.custom({channel: member.guild.owner}, `Ошибка при добавлении роли \`${elm}\``) // Видели? Видели как я перехитрил систему!?
                    );
                });
            }
        })
    }
}