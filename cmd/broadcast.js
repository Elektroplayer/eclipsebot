const ERRORS = require('../lib/errors.js');
//const {MessageEmbed}  = require('discord.js');

module.exports = {
    "run": async (message, bot, args) => {
        //  Я не помню, под чем я был, когда писал эту строку, но я помню, что её писал я
        let string = `{"obj":[${args.slice(1).join(" ").replace(/(```(\w+)?)/g, "").trim()}]}`; //  Это то, что мы будем парсить.
        //console.log(string)
        let a
        try { //  Попыточка
            a = JSON.parse(string).obj[0]; 
        } catch (err) { // Если не получилось
            return ERRORS.custom(message, `Ошибка! Перепроверь свой embed!`, `Подробно: \`${err}\``);
        }

        let chans
        bot.guilds.cache.forEach(guild => {
            chans = guild.channels.cache.filter(m => m.type == "text" && m.permissionsFor(bot.user).has('SEND_MESSAGES'))
            if(chans) chans.first().send({embed: a, disableMentions: "all"}).catch((err)=>{return ERRORS.custom(message, `Ошибка! Перепроверь свой embed!`, `Подробно: \`${err}\``)});
        });

    },

    name: ["broadcast"],
    description: "Отправка Embed сообщения на все сервера",
    show: false,
    ownerOnly: true,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "BOT OWNERS ONLY",
        arguments: "**NOT GRANTED!**",
        examples: `**DON'T USE THIS!**`
    }
}
