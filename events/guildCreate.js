const discord = require('discord.js');
const CONFIG  = require('../config.json');
const PACKAGE = require('../package.json');
// eslint-disable-next-line no-unused-vars
const Client  = require('../lib/client.js');

module.exports = {
    name: "guildCreate",
    /**
     * @param {Client} bot
     * @param {discord.Guild} guild
     */
    run: async function (bot, guild) {

        guild.channels.cache.filter(m => m.type == "text" && m.permissionsFor(bot.user).has('SEND_MESSAGES')).first()
        .send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setFooter('И ещё раз спасибо) © Night Devs')
        .setTitle('Спасибо, что добавили Eclipse на сервер!')
        .setDescription(`Бот поддерживает только русский язык!`)
        .addField(`Информация:`,`Префикс бота: \`${CONFIG.prefix}\`\nКоманда справки: \`${CONFIG.prefix}?\`\nВерсия бота: \`${PACKAGE.version}\`\nСвяжитесь с [поддержкой](https://discord.gg/PHuvYMrvdr) при появлении проблем.`)
        .addField(`Полезные ссылки:`,"[Сервер поддержки](https://discord.gg/YM3KMDM) | [GitHub бота](https://github.com/Elektroplayer/eclipsebot) | [Ссылка на бота](https://discord.com/api/oauth2/authorize?client_id=769659625129377812&permissions=268954832&scope=bot)")
        );

        bot.channels.cache.get(CONFIG.feedbackChannel).send(
            new discord.MessageEmbed().setTitle('Новый сервер!').setColor(CONFIG.colors.successGreen)
            .addField('Имя:', guild.name)
            .addField('ID:', guild.id)
            .addField('Количество людей:', guild.members.cache.size)
        );

    }
}