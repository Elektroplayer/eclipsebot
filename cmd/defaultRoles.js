const CONFIG   = require('../config.json');
const ERRORS   = require('../lib/errors.js');
const UTILS    = require('../lib/utils.js');
const discord  = require('discord.js');
// eslint-disable-next-line no-unused-vars
const Client   = require('../lib/client.js');
const DefaultRoles  = require('../models/defaultRoles.js');

module.exports = {
    /**
     * @param {Client} bot 
     * @param {discord.Message} message 
     * @param {Array<String>} args 
     */
    run: async (bot,message,args)=> {
        if(!args[0]) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help defaultroles** для помощи по команде`)
        if(!['roles', 'add', 'delete', 'enable', 'disable'].includes( args[0].toLowerCase())) return ERRORS.falseArgs(message,`Напиши **${CONFIG.prefix}help defaultroles** для помощи по команде`);

        let footer  = CONFIG.templates.footer.replace('USERNAME', message.author.username);

        DefaultRoles.findOne({guildID:message.guild.id},(err,set)=> {
            if(err) console.log(err);

            if(args[0].toLowerCase() == 'enable') {
                if(!set) {
                    var newDefaultRoles =  new DefaultRoles({
                        guildID: `${message.guild.id}`,
                        memberRoles: [],
                        botRoles: []
                    })
        
                    newDefaultRoles.save().catch(err => console.log(err));
                    ERRORS.success(message, `Дефолтные роли включены!`);
                    return;
                }
                ERRORS.custom(message, `Дефолтные роли уже включены!`);
                return;
            }

            if(!set) return ERRORS.custom(message, `Редактирование настроек невозможно!`,`Включите функцию: \`${CONFIG.prefix}defaultroles enable\` `);

            if(args[0].toLowerCase() == "disable") {
                const embed = new discord.MessageEmbed()
                .setColor(CONFIG.colors.warnOrange)
                .setTitle("ВНИМАНИЕ! Выключение этой функции удалит сохранённые в базе данных настройки!")
                .setDescription("Подтвердите свой выбор!")
                .setFooter(footer)
    
                message.channel.send(embed).then(async msg => {
                    await msg.react('✅');
                    await msg.react('❌');
        
                    let reaction = (await msg.awaitReactions((reaction, user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") && user.id == message.author.id,{max: 1})).first()
        
                    await msg.reactions.removeAll();
        
                    if (reaction.emoji.name == '❌') embed.setTitle("Отменено...").setColor(CONFIG.colors.successGreen).setDescription('Операция была отменена!').setFooter('')
                    else {
                        DefaultRoles.deleteOne({ guildID: message.guild.id }, (err) => { if(err) console.log(err) });

                        embed.setTitle("Выключено...").setColor(CONFIG.colors.successGreen).setDescription('Функция успешно отключена!').setFooter('')
                    }
                    
                    await msg.edit(embed);
                })

                return;
            }

            switch(args[0].toLowerCase()) {
                case 'roles': {
                    message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Текущее значение:').setDescription(set.memberRoles.length != 0 ? UTILS.stringifyArray(set.memberRoles, '<@&', '>, ') : `Не установлено`));
                    if (!message.guild.me.permissions.has('MANAGE_ROLES')) return ERRORS.custom(message, "ВНИМАНИЕ! У меня нет права на выдачу ролей!", "Выдайте права, иначе я не смогу выдавать роли");
                    return;
                }

                case 'add': {
                    if(!args[1]) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help defaultroles** для помощи по команде`);
                    
                    let roles = UTILS.findRoles(message, args[1]);

                    if(roles.length == 0) ERRORS.noRole(message);
                    if(roles.length == 1) {
                        let role = roles[0];

                        if(set.memberRoles.includes(role.id)) return ERRORS.custom(message, "Эта роль уже есть в списке");

                        set.memberRoles.push(role.id);
                        set.save().catch(err => console.log(err));
                        
                        return ERRORS.success(message, `Значение \`roles\` успешно обновлено! **+**\`${role.id}\``)
                    } else {
            
                        message.channel.send(
                            new discord.MessageEmbed().setColor(CONFIG.colors.default)
                            .setTitle('Я нашёл нескольких похожих ролей...')
                            .setFooter(footer)
                            .setDescription(`Выбор **${CONFIG.prefix}<номер>**\n\n`+UTILS.stringifyArray(roles, 'I. ', '\n'))
                        ).then(msg => {
                            let filter     = (collectedMsg) => collectedMsg.author.id == message.author.id && message.content.startsWith(CONFIG.prefix);
                            let collector  = msg.channel.createMessageCollector(filter, {max: 1, idle: 15000});
                
                            collector.on('collect', (m) => {
                                m.delete();
                                msg.delete();
            
                                if(!/^\d+$/.test(m.content.slice(2)) ) return ERRORS.custom(message,'Это не цифра!');
                                if(!roles[parseInt(m.content.slice(2))-1]) return ERRORS.custom(message,'Этого варианта нету!');

                                let role = roles[parseInt(m.content.slice(2))-1];

                                if(set.memberRoles.includes(role.id)) return ERRORS.custom(message, "Эта роль уже есть в списке");

                                set.memberRoles.push(role.id);
                                set.save().catch(err => console.log(err));
                                
                                return ERRORS.success(message, `Значение \`roles\` успешно обновлено! **+**\`${role.id}\``)
                    
                            });
            
                            collector.on('end', c => {
                                if(c.size == 0) {
                                    msg.delete();
                                    return ERRORS.custom(message,'Время истекло!');
                                }
                            })
                        })
                    }
                    break;
                }

                case 'delete': {
                    if(!args[1]) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help defaultroles** для помощи по команде`);

                    let roles = UTILS.findRoles(message, args[1]);

                    if(roles.length == 0) ERRORS.noRole(message);
                    if(roles.length == 1) {
                        let role = roles[0];

                        if(!set.memberRoles.includes(role.id)) return ERRORS.custom(message, "Этой роли нет в списке");

                        set.memberRoles.splice(set.memberRoles.indexOf(role.id), 1)
                        set.save().catch(err => console.log(err));
                        
                        return ERRORS.success(message, `Значение \`roles\` успешно обновлено! **-**\`${role.id}\``)
                    } else {
            
                        message.channel.send(
                            new discord.MessageEmbed().setColor(CONFIG.colors.default)
                            .setTitle('Я нашёл нескольких похожих ролей...')
                            .setFooter(footer)
                            .setDescription(`Выбор **${CONFIG.prefix}<номер>**\n\n`+UTILS.stringifyArray(roles, 'I. ', '\n'))
                        ).then(msg => {
                            let filter     = (collectedMsg) => collectedMsg.author.id == message.author.id && message.content.startsWith(CONFIG.prefix);
                            let collector  = msg.channel.createMessageCollector(filter, {max: 1, idle: 15000});
                
                            collector.on('collect', (m) => {
                                m.delete();
                                msg.delete();
            
                                if(!/^\d+$/.test(m.content.slice(2)) ) return ERRORS.custom(message,'Это не цифра!');
                                if(!roles[parseInt(m.content.slice(2))-1]) return ERRORS.custom(message,'Этого варианта нету!');

                                let role = roles[parseInt(m.content.slice(2))-1];

                                if(!set.memberRoles.includes(role.id)) return ERRORS.custom(message, "Этой роли нет в списке");

                                set.memberRoles.splice(set.memberRoles.indexOf(role.id), 1)
                                set.save().catch(err => console.log(err));
                                
                                return ERRORS.success(message, `Значение \`roles\` успешно обновлено! **-**\`${role.id}\``)                    
                            });
            
                            collector.on('end', c => {
                                if(c.size == 0) {
                                    msg.delete();
                                    return ERRORS.custom(message,'Время истекло!');
                                }
                            });
                        })
                    }

                    break;
                }
            }
        });
    },
    name: ["defaultroles"],
    description: "Настройка дефолтных ролей",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: ["MANAGE_MESSAGES"],
        member: ["ADMINISTRATOR"]
    },
    help: {
        category: "Настройки",
        arguments: "**enable/disable** - Включить/выключить приветствие\n**channel** - Узнать ID текущего канала для приветствий\n**channel <channel>** - Установить канал для приветствий *(можно использоваться имя, ID или упоминание канала)*\n**embed** - Узнать текущее значение поддержки embed\n**embed True/False** - Включить или выключить поддержку embed *(Стирает текущий message)*\n**message** - Узнать текущее приветствие\n**message <message>** - Установить приветствие. Может содержать такие переменные, как {{USERNAME}}, {{MENTION}}, {{TAG}}, {{GUILDNAME}} и {{COUNT}}",
        examples: `**${CONFIG.prefix}welcome enable** - Включаем\n**${CONFIG.prefix}welcome channel приветствия** - Выбираем канал\n**${CONFIG.prefix}welcome channel** - Смотрим\n**${CONFIG.prefix}welcome embed true** - Включаем эмбеды\n**${CONFIG.prefix}welcome embed** - Проверяем\n**${CONFIG.prefix}welcome \\\`\\\`\\\`{ "title": "Хей, {{USERNAME}}! Вотсап бро?", "description": "Ты уже {{COUNT}} браток", "color": 52736}\\\`\\\`\\\`** - Устанавливаем приветствие\n**${CONFIG.prefix}welcome message** - Проверяем\n`
    }
}