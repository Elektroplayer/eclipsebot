const UTILS   = require('../lib/utils.js');
const CONFIG  = require('../config.json');
const ERRORS  = require('../lib/errors.js');

const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (bot,message)=> {
        let response = await UTILS.getJsonResponse(`https://nekos.life/api/v2/img/smug`);
        if(!response) ERRORS.APIErrors(message);

        message.channel.send(
            new MessageEmbed()
            .setColor(CONFIG.colors.default)
            .setTitle(`${message.author.username} доволен`)
            .setImage(response.url)
            .setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username))
        )
    },
    name: ["smug"],
    description: "Улыбнуться",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Картинки",
        arguments: "**Нет**",
        examples: `**${CONFIG.prefix}smug** - Улыбнись)`
    }
}