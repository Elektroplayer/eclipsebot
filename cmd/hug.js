const ERRORS = require('../lib/errors.js');
const UTILS  = require('../lib/utils.js');
const CONFIG = require('../config.json');
const discord = require('discord.js');


module.exports = {
    run: async (bot,message,args)=> {
        let footer = CONFIG.templates.footer.replace('USERNAME', message.author.username);

        if(!args[0]) return ERRORS.notArgs(message,"Упомяни того, кого хочешь обнять");

        let response = await UTILS.getJsonResponse('https://nekos.life/api/v2/img/hug');
        if(!response) ERRORS.APIErrors(message);

        let members = UTILS.findMembers(message, args[0]);

        if(members.length == 0) return ERRORS.noUser(message);
        if(members.length == 1) return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`${message.author.username} обнимает ${members[0].user.username}`).setImage( response.url ).setFooter(footer));

        message.channel.send(
            new discord.MessageEmbed().setColor(CONFIG.colors.default)
            .setTitle('Я нашёл несколько похожих людей...')
            .setDescription(`Выбор **${CONFIG.prefix}<номер>**\n\n` + UTILS.stringifyArray(members,'I. ', '\n'))
            .setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username))
        ).then(msg => {
            let filter     = (collectedMsg) => collectedMsg.author.id == message.author.id && message.content.startsWith(CONFIG.prefix);
            let collector  = msg.channel.createMessageCollector(filter, {max: 1, idle: 10000});

            collector.on('collect', async (m) => {
                m.delete();
                msg.delete();

                if(!/^\d+$/.test(m.content.slice(2)) ) return ERRORS.custom(message,'Это не цифра!');
                if(!members[parseInt(m.content.slice(2))-1]) return ERRORS.custom(message,'Этого варианта нету!');

                let finMember = members[parseInt(m.content.slice(2))-1];

                return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`${message.author.username} обнимает ${finMember.user.username}`).setImage(response.url).setFooter(footer));
            });

            collector.on('end', c => {
                if(c.size == 0) {
                    msg.delete();
                    return ERRORS.custom(message,'Время истекло!');
                }
            })
        })
    },
    name: ["hug"],

    description: "Обнять",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Картинки",
        arguments: "**<@user>** - Кого вы хотите обнять",
        examples: `**${CONFIG.prefix}hug @Electroplayer** - Давайте обнимем Electroplayer :з`
    }
}