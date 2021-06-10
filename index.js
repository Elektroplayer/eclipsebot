//  Подключение библиотек
const discord  = require('discord.js');
const mongoose  = require('mongoose');

//  Подключение файлов
const CONFIG    = require('./config.json');
const Client    = require('./lib/client.js'); //  С большой буквы потому что это класс

//  Константы и переменные
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

//  А вот далее идёт то, что нужно расфасовать по разным файлам!

/*
bot.on('raw', async (event) => {try {EVENTS.raw(bot,event)}catch(err){console.log(err)}}) //  Да, тут теперь только один подключенный файл)

bot.on('guildDelete', (guild) => {try {
    SETTINGS.findOneAndDelete({serverID:guild.id}, (err) => {
        if(err) console.log(err)
        //  Заходим в БД и удаляем этот сервер.
        //  Понимаю, бот не всегда работает и, возможно, какие-то сервера останутся, но их будет гораздо меньше.
        //  Когда будет мало места в БД, тогда и займусь удалением остатков
    })
} catch(err){console.log(err)}})

bot.on('guildDelete', (guild) => {
	bot.channels.cache.get(CONFIG.feedbackChannel).send(
		new discord.MessageEmbed().setTitle('Удалён сервер!').setColor(CONFIG.colors.errorRed)
		.addField('Имя:', guild.name)
		.addField('ID:', guild.id)
		.addField('Количество людей:', guild.members.cache.size)
	)
});

bot.on('guildMemberAdd', (member) => {try {
    EVENTS.guildMemberAdd_server(bot,member);
    //EVENTS.guildMemberAdd_direct(bot,member);
    //EVENTS.guildMemberAdd_autorole(bot,member);
} catch (err) {console.log(err)}});

bot.on('guildMemberRemove', (member) => {try {
    EVENTS.guildMemberRemove_server(bot,member);
    //EVENTS.guildMemberAdd_direct(bot,member);
} catch (err) {console.log(err)}});

*/