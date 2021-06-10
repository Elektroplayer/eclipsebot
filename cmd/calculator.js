const CONFIG          = require('../config.json');
const {MessageEmbed}  = require('discord.js');
const {evaluate}      = require('mathjs');

module.exports = {
    run: async (bot, message, args) => {
        let result;
        try {
            result = evaluate(args.join(" "));
        } catch (error) {
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
        category: "Прочее",
        arguments: "**<пример>** - Само алгебраическое выражение",
        examples: `**${CONFIG.prefix}calc 9+(4/sqrt(16))** - Решит пример данный пример`
    }
}
