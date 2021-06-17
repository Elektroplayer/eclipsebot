// eslint-disable-next-line no-unused-vars
const Client = require('../lib/client.js'), { Message } = require('discord.js');

module.exports = {
    /**
     * @param {Message} message 
     * @param {Client} client 
     * @param {Array<String>} args 
     */
    run: async function (bot, message, args) {
        const code = args.join(" ").replace(/(```(\w+)?)/g, "").trim();
        try {
            let result = await eval(code)
            console.log(result); //  Можно закомментировать. А можно и не комментировать)
            message.channel.send(
                "```js\n" +
                `Result: "${result}"\n` +
                "```"
            );
        } catch (e) {
            message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
        }
    },
    name: ["eval"],
    description: "DANGER!!!",
    show: false,
    ownerOnly: true,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "BOT OWNERS ONLY",
        arguments: "**NOT GRANTED!**",
        examples: `**DON'T USE THIS!**`
    }
}