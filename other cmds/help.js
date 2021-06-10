const ERRORS   = require('../lib/errors.js');
const UTILS    = require('../lib/utils.js');
const discord  = require('discord.js');
const CONFIG   = require('../config.json');

module.exports = {
    run: (bot,message,args)=> {
        let footer = CONFIG.templates.footer.replace('USERNAME', message.author.username);
        if(args[0]) {

            let c = bot.commands.find(m => m.name.includes(args[0])); //  c от command.
            
            if(!c) return ERRORS.falseArgs(message,"Такой команды/алиаса не существует!");

            return message.channel.send(
                new discord.MessageEmbed().setColor(CONFIG.colors.default)
                .setTitle(`Помощь по команде ${c.name[0]}`)
                .setDescription(c.description)
                .addField('Аргументы:', c.help.arguments)
                .addField('Примеры:', c.help.examples)
                .addField('Могут использовать:', `${UTILS.stringifyPermissions(c.permissions.member) || "Все без исключений"}`, true)
                .setFooter(footer)
            );

        }

        let categories = ["Общее", "Полезное", "Модерация", "Картинки", "Прочее"];
        //bot.commands.forEach(value => {if(categories.indexOf(value.help.category) == -1 && value.help.category != "Owners") categories.push(value.help.category)});

        let emb         = new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Помощь').setDescription(`\`${CONFIG.prefix}help <команда>\` для углублённой помощи по команде'`).setFooter(footer)
        let numbers     = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"] //  Ты целый мап сделал для этого. Я разобрался одним массивом!
        
        let fields = {
            "1️⃣": {
                "name": "Содержание",
                "value": ""
            }
        }

        fields['1️⃣'].value = "1. Содержание\n";
        for(let i=0; i < categories.length; i++) {
            fields['1️⃣'].value += `${i+2}. ${categories[i]}\n`;
        }

        let i1 = 0;
        for(;i1<categories.length;i1++) {
            fields[numbers[i1+1]] = {
                "name": categories[i1],
                "value": ""
            }

            bot.commands.filter(m => m.help && m.help.category == categories[i1]).forEach(elm => {
                fields[numbers[i1+1]].value += `**${CONFIG.prefix}${elm.name[0]}** - ${elm.description}\n`
            });

            if(fields[numbers[i1+1]].value == "") fields[numbers[i1+1]].value = "Тут пока ничего нет...";
        }

        message.channel.send(emb.addField(fields['1️⃣'].name,fields['1️⃣'].value))
        .then(async msg=> {

            numbers = numbers.slice(0,i1+1)
            
            for (const number of numbers) await msg.react(number);

            let filter     = (reaction,user) => numbers.includes(reaction.emoji.name) && user.id === message.author.id
            let collector  = msg.createReactionCollector(filter, {idle:3e4});

            collector.on('collect',(r) => {
                try {
                    msg.reactions.cache.get(r.emoji.name).users.remove(message.client.users.cache.get(message.author.id));
                } catch (err) {console.log(err)}

                emb.fields = [fields[r.emoji.name]];
                msg.edit(emb)
            });
            
            collector.on('end', async () => {
                try {
                    await msg.reactions.removeAll();
                    await msg.edit(emb.setFooter(`[Время истекло] ${footer}`));
                } catch (err) {console.log(err)}
            })
        })
    },
    name: ["help","?","h"],
    description: "Помощь",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: ["MANAGE_MESSAGES"],
        member: ["MANAGE_MESSAGES"]
    },
    help: {
        category: "Общее",
        arguments: "**<command>** - Показать более подробную информацию о команде\n**Нет** - Показать список команд",
        examples: `**${CONFIG.prefix}help** - Список всех команд\n**${CONFIG.prefix}help help** - Более подробная информация о help`
    }
}