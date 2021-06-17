const ERRORS   = require('../lib/errors.js');
const UTILS    = require('../lib/utils.js');
const CONFIG   = require('../config.json');

const discord  = require('discord.js');
// eslint-disable-next-line no-unused-vars
const Client = require('../lib/client.js');

module.exports = {
    /**
     * @param {discord.Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    run: (bot,message,args)=> {
        let footer      = CONFIG.templates.footer.replace('USERNAME', message.author.username);
        let categories  = ["Общее", "Картинки", "Модерация", "Настройки", "Прочее"];
        let emb         = new discord.MessageEmbed().setColor(CONFIG.colors.default).setFooter(footer)

        if(args[0]) {
            if(["1","2","3","4","5"].includes(args[0])) {
                let value       = "";

                bot.commands.filter(m => m.help && m.help.category == categories[args[0]-1]).forEach(elm => {
                    value += `**${CONFIG.prefix}${elm.name[0]}** - ${elm.description}\n`
                });

                value = value == "" ? "Здесь пока что ничего нет..." : value;

                return message.channel.send(
                    emb.setTitle(categories[args[0]-1])
                    .setDescription(`\`${CONFIG.prefix}help <команда>\` для углублённой помощи по команде\n\n` + value)
                );
            }

            let c = bot.commands.find(m => m.name.includes(args[0].toLowerCase())); //  c от command.
            
            if(!c) return ERRORS.falseArgs(message,"Такой команды/алиаса не существует!");

            emb.setTitle(`Помощь по команде ${c.name[0]}`)
            .setDescription(c.description)
            .addField('Аргументы:', c.help.arguments)
            .addField('Примеры:', c.help.examples)
            .addField('Могут использовать:', `${c.permissions.member.length !== 0 ? `Люди с этими правами: \`${UTILS.stringifyPermissions(c.permissions.member)}\`` : "Все без исключений"}`, true)

            if(c.name.length != 1) emb.addField('Другие алиасы', UTILS.stringifyArray( c.name.slice(1), '', ', ') ,true);
            
            return message.channel.send(emb);
        }

        message.channel.send(
            new discord.MessageEmbed()
            .setTitle('Помощь')
            .setColor(CONFIG.colors.default)
            .setDescription(`\`${CONFIG.prefix}help <цифра>\` для выбора страницы\n\n` + UTILS.stringifyArray(categories, 'I. ', '\n'))
            .setFooter(footer)
        );
    },
    name: ["help","?","h"],
    description: "Помощь",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Общее",
        arguments: "**Нет** - Показать оглавление\n**<number> - Показать список команд в этой группе**\n**<command>** - Показать более подробную информацию о команде",
        examples: `**${CONFIG.prefix}help** - Оглавление\n**${CONFIG.prefix}help 4** - Команды в группе "Картинки"\n**${CONFIG.prefix}help help** - Более подробная информация о help`
    }
}