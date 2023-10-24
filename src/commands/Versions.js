// eslint-disable-next-line no-unused-vars
import { MessageEmbed, CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import errors from '../structures/Errors.js'
import { version, versions } from '../../versions.js'

export default class VersionCommand extends Command {
    info = {
        description: 'Изменения по версиям',
        name: 'version',
        options: [
            {
                name: 'ver',
                description: 'Если нужны изменения за конкретную версию. `list` для списка версий.',
                type: 'STRING',
                required: false,
            }
        ]
    }

    help = {
        category: 'Прочее',
        arguments: [
            '**<без аргументов>** - Покажет последние изменения.',
            '`ver` - Показать изменения за конкретную версию. *Введи list чтобы узнать список версий.*'
        ],
        using: [
            '**/version** - Изменения за текущую версию.',
            '**/version** `ver: 1.0.1` - Изменения за версию 1.0.1.',
            '**/version** `ver: list` - Список всех версий.'
        ]
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        let ver = interaction.options._hoistedOptions[0]?.value || version

        if(ver == 'list') {
            let vers = []

            for (let key in versions) vers.push(key)

            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(this.client.config.colors.default)
                    .setTitle('Список всех выпущенных версий:')
                    .setFooter({text: this.client.footerMaker(interaction)})
                    .setDescription(vers.join(', '))
                ]
            })
        }
        if(!versions[ver]) return errors.custom(interaction, 'Такой версии не существует!')

        let embed = new MessageEmbed().setColor(this.client.config.colors.default).setTitle(`Версия: ${ver}`).setFooter({text: this.client.footerMaker(interaction)})

        if(versions[ver].new)  embed.addField('Новое:',versions[ver].new)
        if(versions[ver].edit) embed.addField('Изменено:', versions[ver].edit)
        if(versions[ver].bugs) embed.addField('Исправления багов:',versions[ver].bugs)
        if(versions[ver].desc) embed.addField('Что нового:',versions[ver].desc)
        if(versions[ver].del)  embed.addField('Удалено:',versions[ver].del)
        if(versions[ver].teh)  embed.addField('Техническое:',versions[ver].teh)

        await interaction.reply({
            embeds: [ embed ],
        })
    }
}

