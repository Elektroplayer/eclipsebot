// eslint-disable-next-line no-unused-vars
import { MessageEmbed, CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import { evaluate } from 'mathjs'

export default class CalcCommand extends Command {
    info = {
        description: 'Решить пример',
        name: 'calc',
        options: [{
            name: 'solve',
            description: 'Введи алгебраический пример',
            type: 'STRING',
            required: true,
        }]
    }

    help = {
        category: 'Общее',
        arguments: '`solve` - Алгебраическое выражение.',
        using: '**/calc** `solve: 9 + ( 4 / sqrt(16) )` - Решит данный пример.'
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        let result
        try {
            result = evaluate(interaction.options._hoistedOptions[0].value)
        } catch (error) {
            result = 'Ошибка!'
        }
        if (typeof result === 'function') result = 'Ошибка!'

        let resultString = `**Пример:**\n\`\`\` ${interaction.options._hoistedOptions[0].value.replaceAll('`', '\\`')} \`\`\`\n**Итог:**\`\`\`${result}\`\`\``

        if(resultString.length > 4096) result = 'Слишком большое выражение'

        interaction.reply({
            embeds: [
                new MessageEmbed().setColor(result == 'Ошибка!' ? this.client.config.colors.errorRed : this.client.config.colors.default)
                .setTitle('Калькулятор')
                .setDescription(resultString)
                .setFooter({text: this.client.footerMaker(interaction)})
            ],
        })
    }
}

