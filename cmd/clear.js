// eslint-disable-next-line no-unused-vars
const { Message }   = require('discord.js'), Client = require('../lib/client.js');
const CONFIG        = require("../config.json");
const ERRORS        = require('../lib/errors.js');

module.exports = {
    /**
     * @param {Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    run: async function(bot, message, args) {
        if(!args[0]) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help clear** для помощи по команде`);
        if(!/^[0-9]{1,}$/g.test(args[0]) || args[0] == "0" || args[0]>2000) return ERRORS.falseArgs(message, "Можно вводить только цифры, больше 0 и меньше 2000!");

        await message.delete();

        let count = args[0],
            cleaned = 0;

        for (let i; count;) {
            i = (count >= 100 ? 100 : count);
            count -= i;
            const messages = Array.from(await message.channel.bulkDelete(i, true));
            cleaned += messages.length;
        }

        ERRORS.success(message, `Очищено ${cleaned} сообщений.`)
    },
    name: ["clear","clean", "очистить"],
    description: "Очистка сообщений",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: ["MANAGE_MESSAGES"],
        member: ["MANAGE_MESSAGES"]
    },
    help: {
        category: "Модерация",
        arguments: "**<count>** - Удалит заданное количество сообщений",
        examples: `**${CONFIG.prefix}clear 10** - Удалит 10 сообщений`
    }
}