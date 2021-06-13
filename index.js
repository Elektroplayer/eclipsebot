//  Подключение библиотек
const discord  = require('discord.js');
const mongoose  = require('mongoose');

//  Подключение файлов
const CONFIG    = require('./config.json');
const Client    = require('./lib/client.js'); //  С большой буквы потому что это класс

//  Создаём клиента
const bot = new Client({
    ws: {
        intents: discord.Intents.ALL,
    },
    partials: [
        "MESSAGE",
        "REACTION",
        "CHANNEL",
        "GUILD_MEMBER",
        "USER",
    ],
}, {
    commandsDir: "cmd",
    listenersDir: "events",
});

bot.login(CONFIG.token); //  Логиним бота
mongoose.connect(CONFIG.mongoToken, {useNewUrlParser: true, useUnifiedTopology: true}); //  Логиним mongoose
//  CONFIG я конечно же не дам.
//  Подробнее о нём читай на GitHub в README.md, в разделе MiniWiki.

//  Производим загрузку команд и ивентов
bot.loadAll();