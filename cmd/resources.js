const CONFIG  = require('../config.json');
const package = require('../package.json');
const discord = require('discord.js');

function parseMS (milliseconds) {
    let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
    return {
        days: roundTowardsZero(milliseconds / 86400000),
        hours: roundTowardsZero(milliseconds / 3600000) % 24,
        minutes: roundTowardsZero(milliseconds / 60000) % 60,
        seconds: roundTowardsZero(milliseconds / 1000) % 60,
        milliseconds: roundTowardsZero(milliseconds) % 1000
    };
}

module.exports = {
    run: async (bot,message)=> {
        let uptime = parseMS(bot.uptime);
        message.channel.send(
            new discord.MessageEmbed().setColor(CONFIG.colors.default)
            .addField("Техническая информация",
            `Использование ОЗУ:  \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} МБ\`\n` +
            `Версия Node.JS: \`${process.version}\`\n` + 
            `Версия Discord.JS: \`v${discord.version}\`\n` + 
            `Версия бота: \`${package.version}\`\n` +
            `Время работы: \`${uptime.days} : ${uptime.hours} : ${uptime.minutes} : ${uptime.seconds}.${uptime.milliseconds}\``
        ).setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username))
    )
    },
    name: ["resources", "res"],
    description: "Техническая информация о бота",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Прочее",
        arguments: "**Нет**",
        examples: `**${CONFIG.prefix}res** - Дополнительная техническая информация`
    }
}