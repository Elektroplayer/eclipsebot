const Client = require('../lib/client.js'); const { Message, MessageEmbed } = require('discord.js'); const ERRORS = require('../lib/errors.js'); const CONFIG = require('../config.json');

module.exports = {
  /**
 * @param {Message} message
 * @param {Client} client
 * @param {Array<String>} args
 */
  run: async function (client, message, args) {

if (!message.member.hasPermission('MANAGE_EMOJIS')) {
      	ERRORS.notPerms(message, ['MANAGE_EMOJIS'])
      return
    }
    if (!args.length) {
		ERRORS.notArgs(message, 'Дайте эмодзю')
		return
	}

    for (const emojis of args) {
      const getEmoji = discord.Util.parseEmoji(emojis)
      if (getEmoji.id) {
        const emojiExternal = getEmoji.animated ? '.gif' : '.png'
        const emojiURL = `https://cdn.discordapp.com/emojis/${getEmoji.id + emojiExternal}`
        message.guild.emojis
          .create(emojiURL, getEmoji.name)
          .then((emoji) => ERRORS.success(message, 'Эмодзи успешно клонировано!', `Название: \`${emoji.name}\``))
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
