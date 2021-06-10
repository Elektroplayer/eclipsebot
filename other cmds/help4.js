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
        let emb         = new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Помощь').setDescription(`\`${CONFIG.prefix}help <команда>\` для углублённой помощи по команде'`)

        message.channel.send(emb);

        categories.forEach(elm => {
            let value = "";

            bot.commands.filter(m => m.help && m.help.category == elm).forEach(command => {
                value += `**${CONFIG.prefix}${command.name[0]}** - ${command.description}\n`
            });

            if(value !== "") message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(elm).setDescription(value));
        })
    },
    name: ["help4","?4","h4"],
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