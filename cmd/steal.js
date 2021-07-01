// eslint-disable-next-line no-unused-vars
const Client   = require('../lib/client.js');
const discord  = require('discord.js');
const ERRORS   = require('../lib/errors.js');
const CONFIG   = require('../config.json');

module.exports = {
    /**
    * @param {discord.Message} message
    * @param {Client} bot
    * @param {Array<String>} args
    */
    run: async function (bot, message, args) {
        if (!args[0]) return ERRORS.notArgs(message);
        if (!args[1]) {
            const getEmoji = discord.Util.parseEmoji(args[0])
            if (getEmoji.id) {
                const emojiExternal = getEmoji.animated ? '.gif' : '.png';
                const emojiURL = `https://cdn.discordapp.com/emojis/${getEmoji.id + emojiExternal}`;
                try {
                    let cem = await message.guild.emojis.create(emojiURL, getEmoji.name);
                    ERRORS.success(message, `Эмодзи \`${getEmoji.name}\` ${ getEmoji.name != cem.name ? `(\`${cem.name}\`)` : ""} успешно добавлен`)
                } catch (error) {
                    if( (error+"") == "DiscordAPIError: Maximum number of emojis reached (50)" ) ERRORS.custom(message, 'На сервере максимальное количество эмодзи!');
                    else ERRORS.unknown(message)
                }
            }
            return;
        }

        let log = "";

        for (const emojis of args) {
            const getEmoji = discord.Util.parseEmoji(emojis)
            if (getEmoji.id) {
                const emojiExternal = getEmoji.animated ? '.gif' : '.png';
                const emojiURL = `https://cdn.discordapp.com/emojis/${getEmoji.id + emojiExternal}`;
                let cem
                try {
                    cem = await message.guild.emojis.create(emojiURL, getEmoji.name);
                    log += `+ ${getEmoji.name} ${ getEmoji.name != cem.name ? `(${cem.name})` : ""}\n`;
                } catch (error) {
                    if( (error+"") == "DiscordAPIError: Maximum number of emojis reached (50)" ) {
                        ERRORS.custom(message, 'На сервере максимальное количество эмодзи!', `${!log ? "" : `Лог: \`\`\`diff\n${log}\`\`\``}`);
                        return;
                    }
                    else {
                        ERRORS.unknown(message);
                        log += `- ${getEmoji.name}\n`;
                    }
                }
            }
        }

        ERRORS.success(message, 'Лог:', `\`\`\`diff\n${log}\`\`\``)
    },
    name: ['steal', 'stealemoji'],
    description: "Добавить эмодзи со стороннего сервера",
    show: true,
    ownerOnly: false,
    permissions: {
        client: ['MANAGE_EMOJIS'],
        member: ['MANAGE_EMOJIS']
    },
    help: {
        category: 'Общее',
        arguments: '**<эмодзи>** - Один или несколько эмодзи через пробел',
        examples: `${CONFIG.prefix}steal :emoji: - Украдёт эмодзи`
    }
}