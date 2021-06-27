const UTILS   = require('../lib/utils.js');
const CONFIG  = require('../config.json');
const ERRORS  = require('../lib/errors.js');

const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (bot,message)=> {
        let response = await UTILS.getJsonResponse(`https://some-random-api.ml/animu/wink`);
        if(!response) ERRORS.APIErrors(message);

        message.channel.send(
            new MessageEmbed()
            .setColor(CONFIG.colors.default)
            .setTitle(`${message.author.username} подмигивает`)
            .setImage(response.link)
            .setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username))
        )
    },
    name: ["wink"],
    description: "Подмигнуть",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Картинки",
        arguments: "**Нет**",
        examples: `**${CONFIG.prefix}wink** - Подмигни)`
    }
}