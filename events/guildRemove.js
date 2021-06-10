const discord = require('discord.js');
const CONFIG  = require('../config.json');
//const SETTINGS = require('../models/settings.js')
// eslint-disable-next-line no-unused-vars
const Client  = require('../lib/client.js');

module.exports = {
    name: "guildDelete",
    /**
     * @param {Client} bot
     * @param {discord.Guild} guild
     */
    run: async function (bot, guild) {
        // SETTINGS.findOneAndDelete({serverID:guild.id}, (err) => {
        //     if(err) console.log(err)
        //     //  Заходим в БД и удаляем этот сервер.
        //     //  Понимаю, бот не всегда работает и, возможно, какие-то сервера останутся, но их будет гораздо меньше.
        //     //  Когда будет мало места в БД, тогда и займусь удалением остатков
        // })

        bot.channels.cache.get(CONFIG.feedbackChannel).send(
            new discord.MessageEmbed().setTitle('Удалён сервер!').setColor(CONFIG.colors.errorRed)
            .addField('Имя:', guild.name)
            .addField('ID:', guild.id)
            .addField('Количество людей:', guild.members.cache.size)
        )
    }
}