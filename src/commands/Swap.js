import { CommandTypes } from '../structures/Enums.js'
// eslint-disable-next-line no-unused-vars
import { ContextMenuInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import Errors from '../structures/Errors.js'

export default class SwapCommand extends Command {
    info = {
        name: 'Поменять раскладку',
        type: CommandTypes.Message
    }

    help = {
        category: 'Приложения',
        description: 'Сменит раскладку сообщения с английской на русскую и наоборот',
        arguments: [],
        using: [
            '`Message -> Поменять раскладку` - Отправит сообщение с другой раскладкой.',
        ]
    }

    /**
     * @param {ContextMenuInteraction} interaction
     */
    async exec(interaction) {
        // Т. к. мне лень код был успешно спизжен и адаптирован из старой версии
        const message = interaction.options.getMessage('message')

        const alphabets = {
            'ru': 'ёйцукенгшщзхъфывапролджэячсмитьбю.ЁЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,"№;:?'.split(''),
            'en': '`qwertyuiop[]asdfghjkl;\'zxcvbnm,./~QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?@#$^&'.split(''),
            'exception': '.,";:?'.split('')
        }
        const content = message.content.split('')

        if (!content || !content.length) return Errors.custom(interaction, 'Сообщение без текста или с вложением, которые я ещё не понимаю')

        let buffer = 'en'
        let outText = ''

        content.forEach(char => {
            if(alphabets['exception'].indexOf(char) !== -1) {
                char = alphabets[buffer][alphabets[buffer === 'en' ? 'ru' : 'en'].indexOf(char)]
            } else {
                if(alphabets['ru'].indexOf(char) !== -1) {
                    char = alphabets['en'][alphabets['ru'].indexOf(char)]
                    buffer = 'en'
                } else if(alphabets['en'].indexOf(char) !== -1) {
                    char = alphabets['ru'][alphabets['en'].indexOf(char)]
                    buffer = 'ru'
                }
            }

            outText += char
        })

        await interaction.reply({content: outText, ephemeral: true})
    }
}
