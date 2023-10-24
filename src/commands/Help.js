// eslint-disable-next-line no-unused-vars
import { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import Errors from '../structures/Errors.js'
//import Utils from '../structures/Utils.js'

export default class HelpCommand extends Command {
    info = {
        description: 'Список всех команд',
        name: 'help',
        options: [{
            name: 'cmd',
            description: 'Помощь по конкретной команде',
            type: 'STRING',
            required: false,
        }]
    }

    help = {
        category: 'Общее',
        arguments: [
            '**<без аргументов>** - Показать помощь.',
            '`cmd` - Показать более подробную информацию об указанной команде.'
        ],
        using: [
            '**/help** - Оглавление.',
            '**/help** `cmd: help` - Более подробная информация о help.'
        ]
    }

    getValue (category) { // Получаем команды в категории
        let value = ''

        this.client.commands.filter(m => m.help.category == category).forEach(elm => {
            value += `**${ category == 'Приложения' ? '' : '/'}${elm.info.name}** - ${elm.info.description || elm.help.description}\n`
        })

        return value || 'Здесь пока что ничего нет...'
    }

    getRow (categories, num) { // Создание кнопок
        let row = new MessageActionRow()

        categories.forEach((elm, i) => {
            row.addComponents( new MessageButton()
                .setCustomId(`menu_${i+1}`)
                .setLabel(elm)
                .setStyle(i == num ? 'SUCCESS' : 'PRIMARY')
                .setDisabled(i == num)
            )
        })

        return row
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        let cmdName     = interaction.options._hoistedOptions[0]?.value ?? ''
        let categories  = ['Общее', 'Уровни', 'Прочее', 'Приложения']
        let row         = this.getRow(categories, 0)
        let emb         = new MessageEmbed().setColor(this.client.config.colors.default).setFooter({text: this.client.footerMaker(interaction)})

        if( cmdName != '' ) {
            let command = this.client.commands.find(c => c.info.name == cmdName)

            if(!command) return Errors.custom(interaction, 'Такой команды не существует!', 'Напиши /help')
        
            emb.setTitle(`Помощь по команде ${command.info.name}`)
            .setDescription(command.info.description || command.help.description)
            //.addField('Могут использовать:', `${command.permissions.member.length !== 0 ? `Люди с этими правами: \`${Utils.stringifyPermissions(command.permissions.member)}\`` : 'Все без исключений'}`, true)
            
            if(command.help.arguments && command.help.arguments[0]) emb.addField('Аргументы:', Array.isArray(command.help.arguments) ? command.help.arguments?.join('\n') : command.help.arguments)
            if(command.help.using && command.help.using[0]) emb.addField('Примеры использования:',  Array.isArray(command.help.using) ? command.help.using.join('\n') : command.help.using)

            await interaction.reply({
                embeds: [emb]
            })

            return
        }

        await interaction.reply({
            embeds: [
                emb.setTitle('Помощь')
                .setDescription('`/help <команда>` для углублённой помощи по команде\n\n' + this.getValue(categories[0]))
            ],
            components: [row]
        })

        const collector = interaction.channel.createMessageComponentCollector({
            filter: i => i.customId.startsWith('menu_') && i.message.interaction.id === interaction.id,
            idle: 20000
        })

        collector.on('collect', async int => {
            if(int.user.id != interaction.user.id) return Errors.youNotAuthor(interaction, 'help')

            let num  = int.customId.slice(-1) - 1 // Получаем номер кнопки
            row      = this.getRow(categories, num)

            await int.update({ 
                embeds: [
                    emb.setTitle('Помощь')
                    .setDescription( ( num != 4 ? '`/help <команда>` для углублённой помощи по команде' : 'Приложения - не команды!\n Используются по `ПКМ (на сообщение или человека) -> Приложения`') + '\n\n' + this.getValue(categories[num]))
                ],
                components: [row]
            })
        })

        //  Не работает...
        //  Но идея останется в моём сердечке)

        // collector.on('end', async (collected) => {
            
        //     console.log(interact.interaction)
        //     interact.update({ 
        //         components: []
        //     })
        // })
    }
}