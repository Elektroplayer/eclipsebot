const ERRORS  = require('../lib/errors.js');
const CONFIG  = require('../config.json');
const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const Client = require('../lib/client.js');

module.exports = {
    /**
     * @param {discord.Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    run: async (bot,message,args)=> {
        let feedback = args.join(" ");
    
        if (!feedback) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help feedback** для помощи по команде`);
        if (!CONFIG.feedbackChannel || CONFIG.feedbackChannel === "") return;
        if (feedback.length>2000) return ERRORS.falseArgs(message, 'Фидбэк не может быть длиннее 2000 символов!');
    
        let embed = new discord.MessageEmbed()
        .setColor(CONFIG.colors.default)
        .setTitle(`Новый отзыв от ${message.author.tag}`)
        .addField('Сервер:', `\`${message.guild.name}\`\n (ID: \`${message.guild.id}\`)`, true)
        .addField('Канал:', `\`${message.channel.name}\`\n (ID: \`${message.channel.id}\`)`, true)
        .addField('ID сообщения:', `\`${message.id}\``, true)
        .setDescription(feedback)
        .setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username))
        .setTimestamp();
    
        bot.channels.cache.get(CONFIG.feedbackChannel).send(embed);
    
        ERRORS.success(message,"Спасибо за фидбек! Я активно исправляю недочёты своего бота и чужое мнение для меня далеко не последнее в приоритетах.");
    },
    name: ["feedback"],
    description: "Отправить отзыв",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Прочее",
        arguments: "**<text>** - Текст отзыва",
        examples: `**${CONFIG.prefix}feedback У тибя в feedback ашиба!** - Отправит отзыв с текстом "У тибя в feedback ашиба!"`
    }
}