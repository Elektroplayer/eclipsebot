const chalk             = require('chalk');
// eslint-disable-next-line no-unused-vars
const Client            = require('../lib/client');

/**
 * @param {Client} bot 
 * @returns 
 */
function activities (bot) {
    return [
        {name: `Аниме`, options: {type: `WATCHING`}},
        {name: `e.? - Помощь`, options: {type: "PLAYING"}},
        {name: `${bot.guilds.cache.size} серверов`, options: {type: "PLAYING"}},
        {name: `${bot.users.cache.size} пользователей`, options: {type: "PLAYING"}},
    ]
}

module.exports = {
    name: "ready",
    run: async function (bot) {
        
        console.log(chalk.cyan(
            `[Клиент] Бот успешно запущен!\n`+
            `[Клиент] Имя    : ${bot.user.tag}\n`+
            `[Клиент] ID     : ${bot.user.id}\n`+
            `[Клиент] Сервера: ${bot.guilds.cache.size}`
        ));

        let i = 0;
        setInterval(
            () => {
                if(i >= activities(bot).length) i = 0;
                bot.user.setActivity(activities(bot)[i].name, activities(bot)[i].options);
                i++
            }, 15000
        )
    }
}