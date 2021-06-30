const CONFIG         = require('../config.json');
const ERRORS         = require('../lib/errors.js');
const UTILS          = require('../lib/utils.js');
const discord        = require('discord.js');
// eslint-disable-next-line no-unused-vars
const Client         = require('../lib/client.js');
const PrivateVoices  = require('../models/privateVoices.js');

module.exports = {
    /**
     * @param {Client} bot 
     * @param {discord.Message} message 
     * @param {Array<String>} args 
     */
    run: async (bot,message,args)=> {
        if(!args[0]) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help privateVoices** для помощи по команде`)
        if(!['channel', 'template', 'enable', 'disable'].includes( args[0].toLowerCase())) return ERRORS.falseArgs(message,`Напиши **${CONFIG.prefix}help privateVoices** для помощи по команде`);

        let footer  = CONFIG.templates.footer.replace('USERNAME', message.author.username);

        PrivateVoices.findOne({guildID:message.guild.id},(err,set)=> {
            if(err) console.log(err);

            if(args[0].toLowerCase() == 'enable') {
                if(!set) {
                    var newPrivateVoices =  new PrivateVoices({
                        guildID: `${message.guild.id}`,
                        channelID: "",
                        template: "[+] {{USERNAME}}!"
                    })
        
                    newPrivateVoices.save().catch(err => console.log(err));
                    ERRORS.success(message, `Приватные голосовые каналы включены!`);
                    return;
                }
                ERRORS.custom(message, `Приватные голосовые каналы уже включены!`);
                return;
            }

            if(!set) return ERRORS.custom(message, `Редактирование настроек невозможно!`,`Включите функцию: \`${CONFIG.prefix}privateVoices enable\` `);

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
                        PrivateVoices.deleteOne({ guildID: message.guild.id }, (err) => { if(err) console.log(err) });

                        embed.setTitle("Выключено...").setColor(CONFIG.colors.successGreen).setDescription('Функция успешно отключена!').setFooter('')
                    }
                    
                    await msg.edit(embed);
                })

                return;
            }

            switch(args[0].toLowerCase()) {
                case 'channel': {
                    if(!args[1]) {
                        message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Текущее значение:').setDescription(set.channelID || `Не установлено`));
                        if (!message.guild.me.permissions.has(["MANAGE_CHANNELS","MOVE_MEMBERS"]) || !message.guild.channels.cache.get(set.channelID).permissionsFor(bot.user).has(["MANAGE_CHANNELS","MOVE_MEMBERS"])) return ERRORS.custom(message, "ВНИМАНИЕ! У меня нет права на перемещение участников и/или управление каналами!", "Выдайте права, иначе я не смогу создавать приватные комнаты!");

                        return;
                    }

                    let channels = UTILS.findChannels(message, args.slice(1).join(" ") ,'voice');

                    if(channels.length == 0) return ERRORS.noChannel(message);
                    if(channels.length == 1) {
                        if(!message.guild.channels.cache.get(channels[0].id)) return ERRORS.falseArgs(message,'Этот канал не с этого сервера!');

                        set.channelID = channels[0].id;

                        ERRORS.success(message, `Значение \`channel\` успешно установлено на \`${channels[0].id}\``)

                        if (!message.guild.me.permissions.has(["MANAGE_CHANNELS","MOVE_MEMBERS"]) || !message.guild.channels.cache.get(channels[0].id).permissionsFor(bot.user).has(["MANAGE_CHANNELS","MOVE_MEMBERS"])) return ERRORS.custom(message, "ВНИМАНИЕ! У меня нет права на перемещение участников и/или управление каналами!", "Выдайте права, иначе я не смогу создавать приватные комнаты!");

                        set.save().catch(err => console.log(err))
                        return;
                    }
        
                    message.channel.send(
                        new discord.MessageEmbed().setColor(CONFIG.colors.default)
                        .setTitle('Я нашёл несколько похожих каналов...')
                        .setDescription(`Выбор **${CONFIG.prefix}<номер>**\n\n` + UTILS.stringifyArray(channels,'I. ', '\n'))
                        .setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username))
                    ).then(msg => {
                        let filter     = (collectedMsg) => collectedMsg.author.id == message.author.id && message.content.startsWith(CONFIG.prefix);
                        let collector  = msg.channel.createMessageCollector(filter, {max: 1, idle: 15000});
            
                        collector.on('collect', (m) => {
                            m.delete();
                            msg.delete();
        
                            if(!/^\d+$/.test(m.content.slice(2)) ) return ERRORS.custom(message,'Это не цифра!');
                            if(!channels[parseInt(m.content.slice(2))-1]) return ERRORS.custom(message,'Этого варианта нету!');

                            if(!message.guild.channels.cache.get(channels[0].id)) return ERRORS.falseArgs(message,'Этот канал не с этого сервера!');

                            set.channelID = channels[parseInt(m.content.slice(2))-1].id;

                            ERRORS.success(message, `Значение \`channel\` успешно установлено на \`${channels[parseInt(m.content.slice(2))-1].id}\``)
    
                            if (!message.guild.me.permissions.has(["MANAGE_CHANNELS","MOVE_MEMBERS"]) || !message.guild.channels.cache.get(channels[parseInt(m.content.slice(2))-1].id).permissionsFor(bot.user).has(["MANAGE_CHANNELS","MOVE_MEMBERS"])) return ERRORS.custom(message, "ВНИМАНИЕ! У меня нет права на перемещение участников и/или управление каналами!", "Выдайте права, иначе я не смогу создавать приватные комнаты!");

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

                case 'template': {
                    if(!args[1]) return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Текущее значение:').setDescription(set.template || `Не установлено`));
                    
                    let emb = new discord.MessageEmbed().setColor(CONFIG.colors.warnOrange)
                    .setTitle('Тестовое сообщение').setDescription('Используйте галки, чтобы оставить или убрать');

                    let text = args.slice(1).join(" ");

                    //if(!text.test(/{{USERNAME}}/) && !text.test(/{{NICKNAME}}/) && !text.test(/{{TAG}}/) )

                    if(text.length> 100 + 
                        (text.match(/{{USERNAME}}/g) ? text.match(/{{USERNAME}}/g).length * -20 : 0) +
                        (text.match(/{{NICKNAME}}/g) ? text.match(/{{NICKNAME}}/g).length * -20 : 0) + 
                        (text.match(/{{TAG}}/g) ? text.match(/{{TAG}}/g).length * -30 : 0)
                    ) return ERRORS.falseArgs(message, 'Шаблон не может быть длиннее 100 символов!');

                    message.channel.send(text.replace(/{{USERNAME}}/g, message.author.username)
                    .replace(/{{TAG}}/g, `${message.author.tag}`)
                    .replace(/{{NICKNAME}}/g, message.member.nickname || message.author.username)
                    )

                    message.channel.send(emb).then(async msg => {
                        await msg.react('✅');
                        await msg.react('❌');
            
                        let reaction = (await msg.awaitReactions((reaction, user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") && user.id == message.author.id,{max: 1})).first()
            
                        await msg.reactions.removeAll();
            
                        if (reaction.emoji.name == '❌') emb.setTitle("Отменено...").setColor(CONFIG.colors.successGreen).setDescription('Операция была отменена!')
                        else {
                            set.template = text;
    
                            emb.setTitle(`Значение \`template\` успешно установлено на \`${text}\``).setColor(CONFIG.colors.successGreen).setDescription('')
                            
                            set.save().catch(err => console.log(err))
                        }
                        
                        await msg.edit(emb);
                    });
                    
                    break;
                }
            }
        });
    },
    name: ["privatevoices","pv"],
    description: "Настройка приватных каналов",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: ["MANAGE_MESSAGES","ADD_REACTIONS"],
        member: ["ADMINISTRATOR"]
    },
    help: {
        category: "Настройки",
        arguments: "**enable/disable** - Включить/выключить приватные каналы\n**channel** - Узнать ID текущего канала для создания приватных каналов\n**channel <channel>** - Установить канал для создания приватных каналов *(может использоваться имя, ID или упоминание канала. Канал должен находиться в категории! В будущем все каналы в этой категории будут удаляться!)*\n**template** - Узнать текущий шаблон\n**template <template>** - Установить новый шаблон. Может содержать такие переменные как {{USERNAME}}, {{NICKNAME}} и {{TAG}}",
        examples: `**${CONFIG.prefix}privateVoices enable** - Включаем\n**${CONFIG.prefix}privateVoices channel [+] Создать** - Устанавливаем канал\n**${CONFIG.prefix}privateVoices channel** - Смотрим\n**${CONFIG.prefix}privateVoices template [+] {{NICKNAME}}** - Устанавливаем шаблон\n**${CONFIG.prefix}privateVoices template** - Проверяем`
    }
}