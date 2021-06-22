const discord  = require("discord.js");
const CONFIG   = require('../config.json');
const strftime = require("strftime").localizeByIdentifier('ru_RU');

module.exports = {
    /**
     * @param {Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    run: (bot,message)=> {

        message.channel.send(new discord.MessageEmbed()
        .setColor(CONFIG.colors.default)
        .setTitle(`Информация о сервере "${message.guild.name}"`)
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
        .addField("Создан:", strftime('%B %d, %Y год, в %H:%M', message.guild.createdAt))
        .addField("Создатель:", `${message.guild.owner.user.tag}`)
        .addField("Участников всего | из них людей | онлайн | ботов:", `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => !member.user.bot && member.presence.status !== 'offline').size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`)
        .addField("Ролей:", message.guild.roles.cache.size,true)
        .addField('ID:', message.guild.id,true)
        .setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username)));

    },
    name: ["server", "serverinfo"],
    description: "Описание сервера",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Общее",
        arguments: `**Нет**`,
        examples: `**${CONFIG.prefix}server** - Показать информацию о сервере`
    }
}