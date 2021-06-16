const CONFIG   = require('../config.json');
const ERRORS   = require('../lib/errors.js');
const UTILS    = require('../lib/utils.js');
const discord  = require('discord.js');
// eslint-disable-next-line no-unused-vars
const Client   = require('../lib/client.js');
const Goodbye  = require('../models/goodbye.js');

module.exports = {
    /**
     * @param {Client} bot 
     * @param {discord.Message} message 
     * @param {Array<String>} args 
     */
    run: async (bot,message,args)=> {
        if(!args[0]) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help goodbye** для помощи по команде`)
        if(!['channel', 'embed', 'message', 'enable', 'disable'].includes( args[0].toLowerCase())) return ERRORS.falseArgs(message,`Напиши **${CONFIG.prefix}help goodbye** для помощи по команде`);

        let footer  = CONFIG.templates.footer.replace('USERNAME', message.author.username);

        Goodbye.findOne({guildID:message.guild.id},(err,set)=> {
            if(err) console.log(err);

            if(args[0].toLowerCase() == 'enable') {
                if(!set) {
                    var newGoodbye =  new Goodbye({
                        guildID: `${message.guild.id}`,
                        channelID: "",
                        embed: false,
                        message: "Прощай, **{{USERNAME}}**! Нас осталось только {{COUNT}}!"
                    })
        
                    newGoodbye.save().catch(err => console.log(err));
                    ERRORS.success(message, `Уведомления о уходящих людях включены!`);
                    return;
                }
                ERRORS.custom(message, `Уведомления о уходящих людях уже включены!`);
                return;
            }

            if(!set) return ERRORS.custom(message, `Редактирование настроек невозможно!`,`Включите функцию: \`${CONFIG.prefix}goodbye enable\` `);

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
                        Goodbye.deleteOne({ guildID: message.guild.id }, (err) => { if(err) console.log(err) });

                        embed.setTitle("Выключено...").setColor(CONFIG.colors.successGreen).setDescription('Функция успешно отключена!').setFooter('')
                    }
                    
                    await msg.edit(embed);
                })

                return;
            }

            switch(args[0].toLowerCase()) {
                case 'channel': {
                    if(!args[1]) return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Текущее значение:').setDescription(set.channelID || `Не установлено`));

                    let channels = UTILS.findChannels(message,args[1]);

                    if(channels.length == 0) return ERRORS.noChannel(message);
                    if(channels.length == 1) {
                        set.channelID = channels[0].id;

                        ERRORS.success(message, `Значение \`channel\` успешно установлено на \`${channels[0].id}\``)

                        set.save().catch(err => console.log(err))
                        return;
                    }

                    let embed = new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Я нашёл нескольких похожих каналов...').setFooter(footer);
                    let descText = `Выбор **${CONFIG.prefix}<номер>**\n\n`, i = 1;
                    channels.forEach( elm => {
                        descText += `${i}. <#${elm.id}>\n`;
                        i++;
                    });
        
                    message.channel.send(embed.setDescription(descText)).then(msg => {
                        let filter     = (collectedMsg) => collectedMsg.author.id == message.author.id && message.content.startsWith(CONFIG.prefix);
                        let collector  = msg.channel.createMessageCollector(filter, {max: 1, idle: 15000});
            
                        collector.on('collect', (m) => {
                            m.delete();
                            msg.delete();
        
                            if(!/^\d+$/.test(m.content.slice(2)) ) return ERRORS.custom(message,'Это не цифра!');
                            if(!channels[parseInt(m.content.slice(2))-1]) return ERRORS.custom(message,'Этого варианта нету!');

                            set.channelID = channels[parseInt(m.content.slice(2))-1].id;

                            ERRORS.success(message, `Значение \`channel\` успешно установлено на \`${channels[parseInt(m.content.slice(2))-1].id}\``)
    
                            set.save().catch(err => console.log(err))
                            return;
        
                        });
        
                        collector.on('end', c => {
                            if(c.size == 0) {
                                msg.delete();
                                return ERRORS.custom(message,'Время истекло!');
                            }
                        })
                    })

                    break;
                }

                case 'embed': {
                    if(!args[1]) return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Текущее значение:').setDescription(`${set.embed}` || `Не установлено`));

                    let variantsTrue  = ['+','true','yes','y'];
                    let variantsFalse = ['-','false','no','n'];

                    let fin;

                    if( variantsTrue.includes(args[1]) ) fin = true;
                    else if( variantsFalse.includes(args[1]) ) fin = false;
                    else return ERRORS.falseArgs(message,`Можно использовать положительные значения \`${variantsTrue.join(', ')}\` или отрицательные  \`${variantsFalse.join(', ')}\``);

                    if(set.embed == fin) return ERRORS.equalParameters(message,`${fin}`);

                    let emb = new discord.MessageEmbed().setColor(CONFIG.colors.warnOrange)
                    .setTitle('ВНИМАНИЕ! Изменение этого параметра приведёт к изменению параметра `message`')
                    .setDescription(`Его значение будет изменено на \`${ fin ? `{ "title": "Прощай, {{USERNAME}}!", "description": "Нас осталось только {{COUNT}}", "color": 52736}` : `Прощай, **{{USERNAME}}**! Нас осталось только {{COUNT}}!`}\``)
                    .setFooter(footer);

                    message.channel.send(emb).then(async msg => {
                        await msg.react('✅');
                        await msg.react('❌');
            
                        let reaction = (await msg.awaitReactions((reaction, user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") && user.id == message.author.id,{max: 1})).first()
            
                        await msg.reactions.removeAll();
            
                        if (reaction.emoji.name == '❌') emb.setTitle("Отменено...").setColor(CONFIG.colors.successGreen).setDescription('Операция была отменена!').setFooter('')
                        else {
                            set.embed    = fin;
                            set.message  = fin ? `{ "title": "Прощай, {{USERNAME}}!", "description": "Нас осталось только {{COUNT}}", "color": 52736}` : `Прощай, **{{USERNAME}}**! Нас осталось только {{COUNT}}!`
    
                            emb.setTitle(`Значение \`embed\` успешно установлено на \`${fin}\``).setColor(CONFIG.colors.successGreen).setDescription('').setFooter('')
                            
                            set.save().catch(err => console.log(err))
                        }
                        
                        await msg.edit(emb);
                    })

                    break;
                }

                case 'message': {
                    if(!args[1]) return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Текущее значение:').setDescription(set.message || `Не установлено`));

                    let emb = new discord.MessageEmbed().setColor(CONFIG.colors.warnOrange)
                    .setTitle('Тестовое сообщение').setDescription('Используйте галки, чтобы оставить или убрать');

                    if(set.embed) {
                        let stringForParse = `{"obj":[${args.slice(1).join(" ").replace(/(```(\w+)?)/g, "").trim()}]}`; //  Это то, что мы будем парсить.
        
                        let a
                        try { //  Попыточка
                            a = JSON.parse(stringForParse
                            .replace(/{{USERNAME}}/g, message.author.username)
                            .replace(/{{TAG}}/g, `${message.author.tag}`)
                            .replace(/{{GUILDNAME}}/g, `${message.guild.name}`)
                            .replace(/{{COUNT}}/g, `${message.guild.members.cache.size}`)).obj[0];
                            message.channel.send({embed: a, disableMentions: "everyone"});
                        } catch (err) { // Если не получилось
                            return ERRORS.custom(message, `Ошибка! Перепроверь твой embed!`, `Подробно: \`${err}\``);
                        }

                        message.channel.send(emb).then(async msg => {
                            await msg.react('✅');
                            await msg.react('❌');
                
                            let reaction = (await msg.awaitReactions((reaction, user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") && user.id == message.author.id,{max: 1})).first()
                
                            await msg.reactions.removeAll();
                
                            if (reaction.emoji.name == '❌') emb.setTitle("Отменено...").setColor(CONFIG.colors.successGreen).setDescription('Операция была отменена!')
                            else {
                                set.message = stringForParse;
        
                                emb.setTitle(`Значение \`message\` успешно установлено на \`${stringForParse}\``).setColor(CONFIG.colors.successGreen).setDescription('')
                                
                                set.save().catch(err => console.log(err))
                            }
                            
                            await msg.edit(emb);
                        });

                    } else {
                        let text = args.slice(1).join(" ");

                        if(text.length> 2000 + 
                            (text.match(/{{USERNAME}}/g) ? text.match(/{{USERNAME}}/g).length * -20 : 0) + 
                            (text.match(/{{TAG}}/g) ? text.match(/{{TAG}}/g).length * -30 : 0) + 
                            (text.match(/{{GUILDNAME}}/g) ? text.match(/{{GUILDNAME}}/g).length * -19 : 0) + 
                            (text.match(/{{COUNT}/g) ? text.match(/{{COUNT}/g).length * 4 : 0)
                        ) return ERRORS.falseArgs(message, 'Сообщение не может быть длиннее 2000 символов!');

                        message.channel.send(text.replace(/{{USERNAME}}/g, message.author.username)
                        .replace(/{{TAG}}/g, `${message.author.tag}`)
                        .replace(/{{GUILDNAME}}/g, `${message.guild.name}`)
                        .replace(/{{COUNT}}/g, `${message.guild.members.cache.size}`))
                        message.channel.send(emb).then(async msg => {
                            await msg.react('✅');
                            await msg.react('❌');
                
                            let reaction = (await msg.awaitReactions((reaction, user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") && user.id == message.author.id,{max: 1})).first()
                
                            await msg.reactions.removeAll();
                
                            if (reaction.emoji.name == '❌') emb.setTitle("Отменено...").setColor(CONFIG.colors.successGreen).setDescription('Операция была отменена!')
                            else {
                                set.message = text;
        
                                emb.setTitle(`Значение \`message\` успешно установлено на \`${text}\``).setColor(CONFIG.colors.successGreen).setDescription('')
                                
                                set.save().catch(err => console.log(err))
                            }
                            
                            await msg.edit(emb);
                        });
                    }
                    break;
                }
            }
        });
    },
    name: ["goodbye"],
    description: "Настройка прощаний",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: ["MANAGE_MESSAGES"],
        member: ["ADMINISTRATOR"]
    },
    help: {
        category: "Настройки",
        arguments: "**enable/disable** - Включить/выключить прощания\n**channel** - Узнать ID текущего канала для прощаний\n**channel <channel>** - Установить канал для прощаний *(можно использоваться имя, ID или упоминание канала)*\n**embed** - Узнать текущее значение поддержки embed\n**embed True/False** - Включить или выключить поддержку embed *(Стирает текущий message)*\n**message** - Узнать текущее прощания\n**message <message>** - Установить прощания. Может содержать такие переменные, как {{USERNAME}}, {{TAG}}, {{GUILDNAME}} и {{COUNT}}",
        examples: `**${CONFIG.prefix}goodbye enable** - Включаем\n**${CONFIG.prefix}goodbye channel прощания** - Выбираем канал\n**${CONFIG.prefix}goodbye channel** - Смотрим\n**${CONFIG.prefix}goodbye embed true** - Включаем эмбеды\n**${CONFIG.prefix}goodbye embed** - Проверяем\n**${CONFIG.prefix}goodbye \\\`\\\`\\\`{ "title": "Гудбай, {{USERNAME}}! Хорошего пути дальше, бро!", "description": "Осталось {{COUNT}} братоков", "color": 52736}\\\`\\\`\\\`** - Устанавливаем прощания\n**${CONFIG.prefix}goodbye message** - Проверяем\n`
    }
}