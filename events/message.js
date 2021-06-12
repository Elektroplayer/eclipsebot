//const UTILS    = require('../lib/utils.js');
const CONFIG   = require('../config.json');
const ERRORS   = require('../lib/errors.js');
const discord  = require('discord.js');

function getCommand(bot, name) {
    for (const command of bot.commands)
        if (command.name.indexOf(name) !== -1) return command
    return false
}

module.exports = {
    name: "message",
    run: async function (bot, message) {
        if ( message.author.bot || !message.content.startsWith(CONFIG.prefix) || message.channel.type === "dm" ) return;

        let messageArray = message.content.split(/\s+/g),
            cmd          = messageArray[0].slice(CONFIG.prefix.length),
            args         = messageArray.slice(1)

        const command = getCommand(bot, cmd)
        if (!command) return
        
        if (!message.member.permissions.has(command.permissions.member)) return ERRORS.notPerms(message, command.permissions.member.filter(p => !message.member.permissions.has(p)));
        if (!message.guild.me.permissions.has(command.permissions.bot)) return ERRORS.botNotPerms(message, command.permissions.bot.filter(p => !message.guild.me.permissions.has(p)));
        if (command.ownerOnly && !CONFIG.owners.includes(message.author.id)) return ERRORS.ownerOnly(message);

        try { 
            command.run(bot, message, args) 
        } catch (e) {
            console.log(e);

            const embed = new discord.MessageEmbed()
            .setColor(CONFIG.colors.errorRed)
            .setTitle("Ошибка!")
            .setFooter(`${message.author.tag} | © Night Devs`)

            embed.setDescription("Произошла неожиданная ошибка. Извините за предоставленные неудобства.\n" +
                                 "Вы можете помочь нам отправив отчёт о ошибке, будет сообщена следующая информация: " +
                                 "Содержимое сообщения, никнейм и ID автора сообщения, название и ID сервера, имя и ID канала и прочая техническая информация.\n" +
                                 "Продолжить?")

            message.channel.send(embed).then(async msg => {
                await msg.react('✅')
                await msg.react('❌')
    
                let reaction = (await msg.awaitReactions((reaction, user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") && user.id == message.author.id,{max: 1})).first()
    
                await msg.reactions.removeAll()
    
                if (reaction.emoji.name == '❌') embed.setDescription("Отчёт о ошибке не был отправлен. Придётся как нибудь выкручиваться самим :(.")
                else {
                    await bot.channels.cache.get("770009648023339049").send(
                        new discord.MessageEmbed()
                            .setTitle("Ошибка!")
                            .setDescription(`\`\`\`js\n${e}\n\`\`\``)
                            .addField("Автор", `${message.author} (${message.author.id})`, false)
                            .addField("Контент", `\`\`\`\n${message.content}\n\`\`\``, false)
                            .addField("Сервер", `${message.guild.name} (${message.guild.id})`, false)
                            .addField("Канал", `${message.channel.name} (${message.channel.id})`, false)
                            .addField("Ошибка (1000 символов лимит)", `${e.stack.slice(0, 1000)}`, false)
                    )
                    embed.setDescription("Спасибо! Отчёт отчёт об ошибке был отправлен. Очень скоро эта ошибка будет исправлена.")
                }
                
                await msg.edit(embed)
            })
        }
    }
}