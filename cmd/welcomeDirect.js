const CONFIG         = require('../config.json');
const ERRORS         = require('../lib/errors.js');
const discord        = require('discord.js');
// eslint-disable-next-line no-unused-vars
const Client         = require('../lib/client.js');
const WelcomeDirect  = require('../models/welcomeDirect.js');

module.exports = {
    /**
     * @param {Client} bot 
     * @param {discord.Message} message 
     * @param {Array<String>} args 
     */
    run: async (bot,message,args)=> {
        if(!args[0]) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help welcomeDirect** для помощи по команде`)
        if(!['embed', 'message', 'enable', 'disable'].includes( args[0].toLowerCase())) return ERRORS.falseArgs(message,`Напиши **${CONFIG.prefix}help welcomeDirect** для помощи по команде`);

        let footer  = CONFIG.templates.footer.replace('USERNAME', message.author.username);

        WelcomeDirect.findOne({guildID:message.guild.id},(err,set)=> {
            if(err) console.log(err);

            if(args[0].toLowerCase() == 'enable') {
                if(!set) {
                    var newWelcomeDirect =  new WelcomeDirect({
                        guildID: `${message.guild.id}`,
                        channelID: "",
                        embed: false,
                        message: "Добро пожаловать на сервер {{GUILDNAME}}!"
                    })
        
                    newWelcomeDirect.save().catch(err => console.log(err));
                    ERRORS.success(message, `Сообщение новым людям включены!`);
                    return;
                }
                ERRORS.custom(message, `Сообщение новым людям уже включены!`);
                return;
            }

            if(!set) return ERRORS.custom(message, `Редактирование настроек невозможно!`,`Включите функцию: \`${CONFIG.prefix}welcomeDirect enable\` `);

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
                        WelcomeDirect.deleteOne({ guildID: message.guild.id }, (err) => { if(err) console.log(err) });

                        embed.setTitle("Выключено...").setColor(CONFIG.colors.successGreen).setDescription('Функция успешно отключена!').setFooter('')
                    }
                    
                    await msg.edit(embed);
                })

                return;
            }

            switch(args[0].toLowerCase()) {

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
                    .setDescription(`Его значение будет изменено на \`${ fin ? `{ "title": "Добро пожаловать на сервер {{GUILDNAME}}!", "description": "Ты уже {{COUNT}}", "color": 52736}` : `Добро пожаловать на сервер {{GUILDNAME}}!`}\``)
                    .setFooter(footer);

                    message.channel.send(emb).then(async msg => {
                        await msg.react('✅');
                        await msg.react('❌');
            
                        let reaction = (await msg.awaitReactions((reaction, user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") && user.id == message.author.id,{max: 1})).first()
            
                        await msg.reactions.removeAll();
            
                        if (reaction.emoji.name == '❌') emb.setTitle("Отменено...").setColor(CONFIG.colors.successGreen).setDescription('Операция была отменена!').setFooter('')
                        else {
                            set.embed    = fin;
                            set.message  = fin ? `{ "title": "Добро пожаловать на сервер {{GUILDNAME}}!", "description": "Ты уже {{COUNT}}", "color": 52736}` : `Добро пожаловать на сервер {{GUILDNAME}}!`
    
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
                            .replace(/{{MENTION}}/g, `<@!${message.author.id}>`)
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
                            (text.match(/{{MENTION}}/g) ? text.match(/{{MENTION}}/g).length * -10 : 0) + 
                            (text.match(/{{TAG}}/g) ? text.match(/{{TAG}}/g).length * -30 : 0) + 
                            (text.match(/{{GUILDNAME}}/g) ? text.match(/{{GUILDNAME}}/g).length * -19 : 0) + 
                            (text.match(/{{COUNT}/g) ? text.match(/{{COUNT}/g).length * 4 : 0)
                        ) return ERRORS.falseArgs(message, 'Сообщение не может быть длиннее 2000 символов!');

                        message.channel.send(text.replace(/{{USERNAME}}/g, message.author.username)
                        .replace(/{{MENTION}}/g, `<@!${message.author.id}>`)
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
    name: ["welcomedirect"],
    description: "Настройка приветствий",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: ["MANAGE_MESSAGES","ADD_REACTIONS"],
        member: ["ADMINISTRATOR"]
    },
    help: {
        category: "Настройки",
        arguments: "**enable/disable** - Включить/выключить приветствие\n**embed** - Узнать текущее значение поддержки embed\n**embed True/False** - Включить или выключить поддержку embed *(Стирает текущий message)*\n**message** - Узнать текущее приветствие\n**message <message>** - Установить приветствие. Может содержать такие переменные, как {{USERNAME}}, {{MENTION}}, {{TAG}}, {{GUILDNAME}} и {{COUNT}}",
        examples: `**${CONFIG.prefix}welcomedirect enable** - Включаем\n**${CONFIG.prefix}welcomedirect embed true** - Включаем эмбеды\n**${CONFIG.prefix}welcomedirect embed** - Проверяем\n**${CONFIG.prefix}welcomedirect \\\`\\\`\\\`{ "title": "Хей, бро! Ты на сервере {{GUILDNAME}}! Удачки)", "description": "Ты уже {{COUNT}} брат", "color": 52736}\\\`\\\`\\\`** - Устанавливаем приветствие\n**${CONFIG.prefix}welcomedirect message** - Проверяем\n`
    }
}