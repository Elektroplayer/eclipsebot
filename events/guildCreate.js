const discord  = require('discord.js');
const CONFIG   = require('../config.json');
const PACKAGE  = require('../package.json');
// eslint-disable-next-line no-unused-vars
const Client   = require('../lib/client.js');

//let exceptions = []

module.exports = {
    name: "guildCreate",
    /**
     * @param {Client} bot
     * @param {discord.Guild} guild
     */
    run: async function (bot, guild) {

        if(!guild) return; //  Ходит слух, что он активируется, когда бот запускается

        let bots = guild.members.cache.filter(m => m.user.bot).size;
        let all  = guild.members.cache.size;
        // let test = bots > 50 && (bots / all) > 0.5; // Если ботов больше 50 и их больше половины, то сервер приравнивается к спам-серверам
        
        // if(test && !exceptions.includes(guild.id)) {
        //     guild.owner.send(new discord.MessageEmbed().setTitle('На вашем сервере было обнаружено более чем 50 ботов и их больше чем людей, поэтому он был помечен как спам-сервер!').setDescription('Если это ошибка, обратитесь в [поддержку](https://discord.gg/PHuvYMrvdr)!'))

        //     bot.channels.cache.get(CONFIG.feedbackChannel).send(
        //         new discord.MessageEmbed().setTitle('Попытка входа на спам-сервер!').setColor(CONFIG.colors.warnOrange)
        //         .addField('Имя:', guild.name)
        //         .addField('ID:', guild.id)
        //         .addField('Количество людей / из них ботов:', `${all} / ${bots}`)
        //     );

        //     guild.leave();
        //     return;
        // }

        guild.channels.cache.filter(m => m.type == "text" && m.permissionsFor(bot.user).has('SEND_MESSAGES')).first()
        .send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setFooter('И ещё раз спасибо) © Night Devs')
        .setTitle('Спасибо, что добавили Eclipse на сервер!')
        .setDescription(`Бот поддерживает только русский язык!`)
        .addField(`Информация:`,`Префикс бота: \`${CONFIG.prefix}\`\nКоманда справки: \`${CONFIG.prefix}?\`\nВерсия бота: \`${PACKAGE.version}\`\nСвяжитесь с [поддержкой](https://discord.gg/PHuvYMrvdr) при появлении проблем.`)
        .addField(`Полезные ссылки:`,`[Сервер поддержки](https://discord.gg/PHuvYMrvdr) | [GitHub бота](https://github.com/Elektroplayer/eclipsebot) | [Ссылка на бота](https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=${CONFIG.authCode}&scope=bot)`)
        );

        bot.channels.cache.get(CONFIG.feedbackChannel).send(
            new discord.MessageEmbed().setTitle('Новый сервер!').setColor(CONFIG.colors.successGreen)
            .addField('Имя:', guild.name)
            .addField('ID:', guild.id)
            .addField('Количество людей / из них ботов:', `${all} / ${bots}`)
        );

    }
}