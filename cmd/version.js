const package  = require('../package.json');
const versions = require('../versions.json');
const ERRORS   = require('../lib/errors.js');
const CONFIG   = require('../config.json');
const discord  = require('discord.js');
// eslint-disable-next-line no-unused-vars
const Client   = require('../lib/client.js');

module.exports = {
    /**
     * @param {Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    run: async (bot,message,args)=> {
        let ver = args[0] || package.version

        if(ver == "list") {
            let vers = [];
            for (let key in versions) vers.push(key)

            message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`Список всех выпущенных версий:`).setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username))
            .setDescription(vers.join(', ')))
            return
        }
        if(!versions[ver]) return ERRORS.custom(message, "Такой версии не существует!")

        let embed = new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`Версия: ${ver}`).setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username))

        if(versions[ver].new)  embed.addField('Новое:',versions[ver].new)
        if(versions[ver].edit) embed.addField('Изменено:', versions[ver].edit)
        if(versions[ver].bugs) embed.addField('Исправления багов:',versions[ver].bugs)
        if(versions[ver].desc) embed.addField('Что нового:',versions[ver].desc)
        if(versions[ver].del)  embed.addField('Удалено:',versions[ver].del)
        if(versions[ver].teh)  embed.addField('Техническое:',versions[ver].teh)

        message.channel.send(embed)
    },
    name: ["version","ver"],

    description: "Что изменилось в последней версии",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Общее",
        arguments: "**Нет**",
        examples: `**${CONFIG.prefix}version** - Версия бота и что нового`
    }
}