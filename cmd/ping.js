const CONFIG = require('../config.json');
const { MessageEmbed} = require('discord.js');

module.exports = {
    run: async (bot,message)=> {

        const msg = await message.channel.send(new MessageEmbed().setColor(CONFIG.colors.default).setTitle(`🏓 Проверка...`));

        msg.edit(new MessageEmbed().setColor(CONFIG.colors.default)
            .setTitle(`🏓 Понг!`)
            .addField(`Задержка:`, `${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`)
            .addField(`Задержка API:`, ` ${Math.round(bot.ws.ping)}ms`)
            .setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username))
        );
    },
    name: ["ping"],
    description: "Пинг",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Общее",
        arguments: "**Нет**",
        examples: `**${CONFIG.prefix}ping** - Показать скорость соединения от хоста до серверов Discord`
    }
}