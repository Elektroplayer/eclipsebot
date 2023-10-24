/* eslint-disable no-unused-vars */
import { MessageEmbed, CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import { parseMS, ru_RUmod } from '../structures/Utils.js'
import Donates from '../models/Donates.js'
import strftime from 'strftime'

export default class BotCommand extends Command {
    info = {
        description: 'Информация о боте',
        name: 'botinfo'
    }

    help = {
        category: 'Прочее',
        arguments: [
            '**<без аргументов>** - Покажет информацию о боте.'
        ],
        using: []
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        let donatesArray = await Donates.find().sort([['total', 'descending']]).exec()
        let donaters = ''

        donatesArray.forEach(elm => {
            donaters += `\`${elm.name}\` - ${elm.total}₽\n`
        })

        let uptime = parseMS(this.client.uptime)
        let embed = new MessageEmbed().setColor(this.client.config.colors.default)
        .setTitle('Информация о боте')
        .addField('Основное',
                    `Пользователей: \`${this.client.users.cache.size}\`\n` +
                    `Серверов: \`${this.client.guilds.cache.size}\`\n` + 
                    `Дата создания: \`${strftime.localize(ru_RUmod)('%d %B %Y г., %H:%M', new Date(this.client.user.createdTimestamp))}\`\n` +
                    `Время работы: \`${uptime.days} : ${uptime.hours} : ${uptime.minutes} : ${uptime.seconds}.${uptime.milliseconds}\``
        ).addField('Night Devs это:',
                    '**Участники:**\n' +
                    '`[ElectroPlayer]#0256` - Разработчик, владелец проекта\n' +
                    '`Lookins#4727` - Тестировщик, баг хантер\n' +
                    '`Lokilife#3331` - Разработчик бота, разработчик сайта\n' +
                    '\n' +
                    '**Донатеры**\n' +
                    (donaters || 'Пока что нет')
        ).addField('Полезные ссылки', '[Сервер поддержки](https://discord.gg/PHuvYMrvdr)\n' + 
                    '[GitHub бота](https://github.com/Night-Devs/EclipseBot)\n' +
                    '[На чай](https://www.donationalerts.com/r/electroplayer)',true)
        .setImage('https://cdn.discordapp.com/attachments/770009593131827300/887699952896200754/banner.png')
        .setFooter({text: this.client.footerMaker(interaction, 'Когда-то тут был ещё один...')})

        await interaction.reply({
            embeds: [embed]
        })
    }
}

