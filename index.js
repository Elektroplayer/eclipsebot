//  Подключение библиотек
const mongoose  = require('mongoose');
const dotenv    = require('dotenv');

//  Подключение файлов
dotenv.config(); //  Конфигурация (.env)
const Client = require('./lib/client.js'); //  С большой буквы потому что это класс

//  Создаём клиента
const bot = new Client({
    ws: {
        intents: [
            "GUILDS",
            "GUILD_MEMBERS",
            "GUILD_EMOJIS",
            "GUILD_VOICE_STATES",
            "GUILD_PRESENCES",
            "GUILD_MESSAGES",
            "GUILD_MESSAGE_REACTIONS",
            "GUILD_MESSAGE_TYPING"
        ],
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
//  Подробнее о process.env читай на GitHub в README.md, в разделе MiniWiki.

//  Производим загрузку команд и ивентов
bot.loadAll();