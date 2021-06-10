const UTILS   = require('../lib/utils.js');
const CONFIG  = require('../config.json');
const ERRORS  = require('../lib/errors.js');
const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const Client  = require('../lib/client.js');

module.exports = {
    /**
     * @param {discord.Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    run: async (bot,message)=> {
        if(!message.channel.nsfw) return ERRORS.custom(message, 'Это не NSFW канал')

        let arr = ['Random_hentai_gif','lewd','hentai','classic'];

        let response = await UTILS.getJsonResponse(`https://nekos.life/api/v2/img/` + arr[Math.floor(Math.random() * arr.length)]);

        message.channel.send(
            new discord.MessageEmbed()
            .setColor(CONFIG.colors.default)
            .setTitle(`Хентай`)
            .setImage(response.url)
            .setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username))
        )
    },
    name: ["hentai"],
    description: "18+",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Картинки",
        arguments: "**Нет**",
        examples: `**${CONFIG.prefix}hentai** - Что-то запрещённое...`
    }
}