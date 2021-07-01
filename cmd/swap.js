const CONFIG  = require('../config.json');
const ERRORS  = require("../lib/errors.js");
// eslint-disable-next-line no-unused-vars
const Client  = require("../lib/client.js"), { Message } = require("discord.js");

module.exports = {
    /**
     * @param {Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    run: async (bot, message, args) => {
        await message.delete();

        if(!args[0]) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help swap** для помощи по команде`)

        let alphabets   = {
            "ru":  `ёйцукенгшщзхъфывапролджэячсмитьбю.ЁЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,"№;:?`.split(""),
            "en": `\`qwertyuiop[]asdfghjkl;'zxcvbnm,./~QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?@#$^&`.split(""),
            "exception": `.,";:?`.split("")
        };   //  Алфавиты

        let inpText //= args.join(" ").split("");  //  Входной текст

        if(args[0] == "!!") {
            let messages = await message.channel.messages.fetch({ limit:25 })
            messages = messages.filter(m=> m.author.id == message.author.id).array()
            
            if(messages.length <= 1) return ERRORS.custom(message, 'Ваше предыдущее сообщение не было найдено!');

            inpText = messages[1].content.split("");
        } else if (args[0] == "!") {
            let messages = await message.channel.messages.fetch({ limit:5 })
            messages = messages.array()
            
            if(messages.length <= 1) return ERRORS.custom(message, 'Предыдущее сообщение не было найдено!');

            inpText = messages[0].content.split("");
        } else {
            inpText = args.join(" ").split("");
        }



        let outText     = ""; //  Выходной текст

        let buffer = "en";
        inpText.forEach(e => {
            
            if(alphabets["exception"].indexOf(e) != -1) {
                e = alphabets[buffer][alphabets[buffer == "en" ? "ru" : "en"].indexOf(e)]
            } else {
                if(alphabets["ru"].indexOf(e) != -1) {
                    e = alphabets["en"][alphabets["ru"].indexOf(e)]
    
                    buffer = "en";
                } else if(alphabets["en"].indexOf(e) != -1) {
                    e = alphabets["ru"][alphabets["en"].indexOf(e)]
                    
                    buffer = "ru";
                }
            }

            outText = outText + e;

        })

        message.channel.send(outText.replace("@here", "`@here`").replace("@everyone", "`@everyone`"));
        
    },
    name: ["swap"],
    description: "Заменить раскладку",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Общее",
        arguments: "**<текст с неправильной раскладкой>** - Поменяет раскладку клавиатуры у текста\n**!** - Поменяет раскладку предыдущего сообщения\n**!!** - Поменяет раскладку предыдущего вашего сообщения",
        examples: `**${CONFIG.prefix}swap Ghbdtn? rfr e nt,z ltkf&** - Поменяет раскладку и выведет "Привет, как у тебя дела?"`
    }
}
