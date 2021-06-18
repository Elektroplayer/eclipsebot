const ERRORS  = require('../lib/errors.js');
const CONFIG  = require('../config.json');

module.exports = {
    run: async (bot, message, args) => {
        if(!args[0]) return ERRORS.notArgs(message);

        let string = `{"obj":[${args.join(" ").replace(/(```(\w+)?)/g, "").trim()}]}`; //  Это то, что мы будем парсить
        
        try { //  Попыточка
            let a = JSON.parse(string).obj[0]; 
            return message.channel.send({embed: a, disableMentions: "all"}).catch(() => ERRORS.custom(message, `Перепроверь свой embed!`) );
        } catch (err) { // Если не получилось
            return ERRORS.custom(message, `Ошибка! Перепроверь твой embed!`, `Подробно: \`${err}\``);
        }
    },
    name: ["embed", "sendembed"],
    description: "Отправка Embed сообщения",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Общее",
        arguments: "<\\`\\`\\`JSON embed код\\`\\`\\`>",
        examples: `${CONFIG.prefix}sendembed \\\`\\\`\\\`{\n**    **"title": "Угу",\n**    **"description": "Это работает!",\n**    **"color": "#cccccc"\n}\\\`\\\`\\\``
    }
}
