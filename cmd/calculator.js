const CONFIG          = require('../config.json');
const ERRORS          = require('../lib/errors.js');
const {MessageEmbed}  = require('discord.js');
const {evaluate}      = require('mathjs');

module.exports = {
    run: async (bot, message, args) => {
        if(!args.join(" ")) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help calculator** для помощи по команде`)
        let result;
        try {
            result = evaluate(args.join(" "));
        } catch (error) {
            result = "Ошибка!";
        }
        if (typeof result === "function") {
            result = "Ошибка!";
        }
        return message.channel.send(
            new MessageEmbed().setColor(result == "Ошибка!" ? CONFIG.colors.errorRed : CONFIG.colors.default)
            .setTitle("Калькулятор")
            .setDescription(`**Пример:**\n\`\`\`${args.join(" ")}\`\`\`\n**Итог:**\`\`\`${result}\`\`\``)
        );
    },
    name: ["calculator", "calc"],
    description: "Калькулятор",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Общее",
        arguments: "**<пример>** - Само алгебраическое выражение",
        examples: `**${CONFIG.prefix}calc 9+(4/sqrt(16))** - Решит данный пример`
    }
}
