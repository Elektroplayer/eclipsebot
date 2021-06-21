//  Подключение библиотек
const discord  = require('discord.js');
const mongoose  = require('mongoose');
const dotenv = require('dotenv');

//  Подключение файлов
//const CONFIG    = require('./config.json');
dotenv.config();
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

bot.login(process.env.TOKEN); //  Логиним бота
mongoose.connect(process.env.MONGOTOKEN, {useNewUrlParser: true, useUnifiedTopology: true}); //  Логиним mongoose
//  CONFIG я конечно же не дам.
//  Подробнее о нём читай на GitHub в README.md, в разделе MiniWiki.

//  Производим загрузку команд и ивентов
bot.loadAll();