// eslint-disable-next-line no-unused-vars
import { MessageEmbed, CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import strftime from 'strftime'
import {ru_RUmod} from '../structures/Utils.js'

export default class ProfileCommand extends Command {
    info = {
        description: 'Узнать о человеке больше',
        name: 'profile',
        options: [
            {
                name: 'user',
                description: 'Если хочешь узнать информацию о другом человеке',
                type: 'USER',
                required: false
            }
        ]
    }

    help = {
        category: 'Общее',
        arguments: [
            '**<без аргументов>** - Покажет профиль автора.',
            '`user` - Покажет профиль упомянутого человека.'
        ],
        using: [
            '**/profile** - Покажет информацию об авторе.',
            '**/profile** `user: GoodUser#1234` - Покажет информацию об указанном пользователе.'
        ]
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        let member = interaction.options._hoistedOptions[0]?.member ?? interaction.member

        //  Все даты
        let day   = 1000 * 60 * 60 * 24
        let date1 = new Date(interaction.createdTimestamp)
        let date2 = new Date(member.user.createdTimestamp)
        let date3 = new Date(member.joinedTimestamp)
        let diff1 = Math.round(Math.abs((date1.getTime() - date2.getTime()) / day))
        let diff2 = Math.round(Math.abs((date1.getTime() - date3.getTime()) / day))

        let rawRoles = Array.from(member.roles.cache).filter((r) => r.id !== interaction.guild.id)
        let roleCount = rawRoles.length //  Находим количество ролей
        let big = false

        if(roleCount > 40) {
            rawRoles = rawRoles.slice(0, 40)
            big = true
        }

        let roles = rawRoles.sort((a, b) => b.rawPosition - a.rawPosition).map((r) => r[1]).join(', ') + (big ? '...' : '') || 'Отсутствуют'

        // TODO: Репутация и уровень
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(`${member.user.username} ${member.nickname ? `aka ${member.nickname}` : ''}`)
                .setColor(this.client.config.colors.default)
                .addField('Дата регистрации:', `\`${strftime.localize(ru_RUmod)('%d %B %Y г., %H:%M', date2)}\`\n(\`${diff1}\` дней назад)`,true)
                .addField('Подключился на сервер:', `\`${strftime.localize(ru_RUmod)('%d %B %Y г., %H:%M', date3)}\`\n(\`${diff2}\` дней назад)`,true)
                .addField('ID:',`\`${member.id}\``)
                .addField(`Роли (${roleCount}):`, `${roles}`)
                .setFooter({text: this.client.footerMaker(interaction)})
            ],
        })
    }
}