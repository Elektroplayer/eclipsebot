const discord = require('discord.js');
const CONFIG  = require('../config.json');
// eslint-disable-next-line no-unused-vars
const Client  = require('../lib/client.js');

//  Все модели
const DefaultRoles   = require('../models/defaultRoles.js');
const Goodbye        = require("../models/goodbye.js");
const PrivateVoices  = require("../models/privateVoices.js");
const Welcome        = require("../models/welcome.js");
const WelcomeDirect  = require("../models/welcomeDirect.js");

module.exports = {
    name: "guildDelete",
    /**
     * @param {Client} bot
     * @param {discord.Guild} guild
     */
    run: async function (bot, guild) {

        //  Сносим все настройки

        DefaultRoles.deleteOne({ guildID: guild.id }, (err) => { if(err) console.log(err) });
        Goodbye.deleteOne({ guildID: guild.id }, (err) => { if(err) console.log(err) });
        PrivateVoices.deleteMany({ guildID: guild.id }, (err) => { if(err) console.log(err) });
        Welcome.deleteOne({ guildID: guild.id }, (err) => { if(err) console.log(err) });
        WelcomeDirect.deleteOne({ guildID: guild.id }, (err) => { if(err) console.log(err) });

        //  Оповещаем
        bot.channels.cache.get(CONFIG.feedbackChannel).send(
            new discord.MessageEmbed().setTitle('Удалён сервер!').setColor(CONFIG.colors.errorRed)
            .addField('Имя:', guild.name)
            .addField('ID:', guild.id)
            .addField('Количество людей:', guild.members.cache.size)
        )
    }
}