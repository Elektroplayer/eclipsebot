// eslint-disable-next-line no-unused-vars
const Client   = require('../lib/client.js');
const discord  = require('discord.js');
const ERRORS   = require('../lib/errors.js');

module.exports = {
    /**
    * @param {discord.Message} message
    * @param {Client} client
    * @param {Array<String>} args
    */
    run: async function (client, message, args) {
        if (!args.length) return ERRORS.notArgs(message);

        for (const emojis of args) {
            const getEmoji = discord.Util.parseEmoji(emojis)
            if (getEmoji.id) {
                const emojiExternal = getEmoji.animated ? '.gif' : '.png';
                const emojiURL = `https://cdn.discordapp.com/emojis/${getEmoji.id + emojiExternal}`;
                message.guild.emojis
                .create(emojiURL, getEmoji.name)
                .then((emoji) => ERRORS.success(message, 'Эмодзи успешно клонировано!', `Название: \`${emoji.name}\``))
            }
        }
    },
    name: ['steal', 'stealemoji', 'se'],
    description: "Добавить эмодзи со стороннего сервера.",
    show: true,
    ownerOnly: false,
    permissions: {
        client: ['MANAGE_EMOJIS'],
        member: ['MANAGE_EMOJIS']
    },
    help: {
        category: '5',
        arguments: ':emoji:',
        examples: 'e.steal :emoji:'
    }
}