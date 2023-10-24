/// <reference types="Steal.d.ts">
import { CommandTypes } from '../structures/Enums.js'
// eslint-disable-next-line no-unused-vars
import Command from '../structures/Command.js'

export default class SwapCommand extends Command {
    info = {
        name: 'Украсть эмоджи <:)',
        type: CommandTypes.Message
    }
    enabled = false

    /**
     * @param {StealContextMenuInteraction} interaction
     */
    async exec(interaction) {
        const message = interaction.options.getMessage('message')

        const rawEmojis = message.content.match(/<a?:[A-Za-z_]{2,}:\d{18}>/gm)

        if (!rawEmojis)
            return interaction.reply({content: 'Увы, я не вижу эмоджи в этом сообщении, может быть вы промахнулись не по тому сообщению?', ephemeral: true})

        const emojis = Array.from(rawEmojis).map(function (rawEmojis) {
            const emojiArray = rawEmojis.replaceAll(/[<>]/gm, '').split(':')

            const isAnimated = emojiArray[0] === 'a'
            const name = emojiArray[1]
            const id = emojiArray[2]

            return {
                isAnimated,
                name,
                id,
                text: `<${isAnimated ? 'a:' : ':'}${name}:${id}>`
            }
        }).filter(emoji => !interaction.guild.emojis.resolve(emoji.id))

        if (!emojis.length)
            return interaction.reply({content: 'Увы, я не вижу эмоджи в этом сообщении, может быть в промахнулись не по тому сообщению?', ephemeral: true})

        const myMessage = await interaction.reply({embeds:
            [{
                title: 'Какие эмоджи вы хотите украсть?',
                fields: emojis.map(emoji => ({
                    name: emoji.name,
                    value: emoji.text,
                }))
            }], fetchReply: true
        })

        for (const emoji of emojis)
            await myMessage.react(emoji.text)

        /**
         * @type {({
         *     name: string,
         *     id: string,
         *     isAnimated: boolean
         * })}
         */
        const selectedEmoji = await new Promise(res => myMessage.createReactionCollector({
            idle: 30e3,
            max: 1,
            filter: reaction => emojis.find(emoji => emoji.id === reaction.emoji.id) &&
                                reaction.users.resolve(interaction.member.user.id)
        }).on('collect', reaction => res(emojis.find(emoji => emoji.id === reaction.emoji.id))).on('end', () => res()))

        if (!selectedEmoji) {
            await myMessage.delete()
            const myMessage2 = await interaction.channel.send({content: `Увы или к счастью вы так и не выбрали эмоджи, попробуйте ещё раз.\nКоманда вызвана ${interaction.member.user.tag}`})
            await new Promise(res => setTimeout(() => res(myMessage2.delete()), 10e3))
            return
        }

        await interaction.guild.emojis.create(
            `https://cdn.discordapp.com/emojis/${selectedEmoji.id + (selectedEmoji.isAnimated ? '.gif' : '.png')}`,
            selectedEmoji.name
        )
    }
}
