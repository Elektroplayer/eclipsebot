// eslint-disable-next-line no-unused-vars
import {MessageEmbed, CommandInteraction, MessageActionRow, MessageButton} from 'discord.js'
import Command from '../structures/Command.js'
import LevelsMember from '../models/LevelsMember.js'
import LevelsServer from '../models/LevelsServer.js'
import Errors from '../structures/Errors.js'

function f(x) { // По сути, это самая обычная математическая функция, поэтому и просто f с просто аргументом x.
    return 300 + Math.floor(300 * x * Math.pow(1.06, x) )
}

function getLevel (xp) {
    if (xp< 0) return {
        level: -1,
        xp: xp
    }
    let level = 0
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (xp - f(level) >= 0) {
            xp -= f(level)
            level++
        } else break
    }
    return {
        level: level,
        xp: xp
    }
}

export default class LeaderboardCommand extends Command {
    info = {
        description: 'Рейтинг по уровню',
        name: 'leaderboard'
    }

    help = {
        category: 'Уровни',
        arguments: [
            '**<без аргументов>** - Показать рейтинг по уровню текущего сервера.'
        ],
        using: []
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        let serverSettings = await LevelsServer.findOne({guildID: interaction.guild.id}).exec()
        if(!serverSettings || !serverSettings.enabled) return Errors.noLevels(interaction)

        // let member = interaction.options._hoistedOptions[0]?.member ?? interaction.member

        let lb = await LevelsMember.find({guildID: interaction.guild.id}).sort([['xp', 'descending']]).exec()
        lb = lb.filter(elm => interaction.guild.members.cache.get(elm.memberID))
        let embed = new MessageEmbed().setColor(this.client.config.colors.default)
        .setTitle('Рейтинг:')

        if(lb.length<=9) { // Тут всё просто
            for(let i = 0; i<lb.length;i++) {
                if (interaction.guild.members.cache.get(lb[i].memberID))
                    embed.addField(`${i+1}. ${interaction.guild.members.cache.get(lb[i].memberID).user.tag}`, `Уровень: \`${getLevel(lb[i].xp).level}\`\nОпыт: \`${getLevel(lb[i].xp).xp} / ${f(getLevel(lb[i].xp).level)}xp\``,true)
            }

            await interaction.reply({
                embeds: [embed.setFooter({text: this.client.footerMaker(interaction)})]
            })
        } else { // А тут жесть

            //  Создаём страницы
            let page  = 0
            let pages = [] // Массив из страниц - массивов с объектами полей.

            for( let i = 0, cp = -1 ;i<lb.length;i++ ) { // Алгоритм, возможно, немного странный, но что есть
                if(i%9 == 0) {
                    cp++
                    pages[cp] = []
                }

                pages[cp].push({
                    name: `${i+1}. ${interaction.guild.members.cache.get(lb[i].memberID).user.tag}`,
                    value: `Уровень: \`${getLevel(lb[i].xp).level}\`\nОпыт: \`${getLevel(lb[i].xp).xp} / ${f(getLevel(lb[i].xp).level)}xp\``,
                    inline: true
                })
            }

            // Создаём кнопки
            let row = new MessageActionRow()
            let buttons = {
                ld_first: '⏪',
                ld_prev: '◀️',
                ld_me: '⏺️',
                ld_next: '▶️',
                ld_last: '⏩'
            }

            for(let key in buttons) { // и добавляем их
                row.addComponents( new MessageButton()
                    .setCustomId(key)
                    .setStyle('PRIMARY')
                    .setDisabled(false)
                    .setEmoji(buttons[key])
                )
            }

            // Отправляем сообщение
            await interaction.reply({
                embeds: [embed.addFields(pages[page]).setFooter(this.client.footerMaker(interaction, `Страница: ${page+1}/${pages.length}`))],
                components: [row]
            })

            // И создаём коллектор на копки
            interaction.channel.createMessageComponentCollector({
                filter: i => i.customId.startsWith('ld_') && i.message.interaction.id === interaction.id,
                idle: 20000
            }).on('collect', async int => { // А когда что-то получил...
                if(int.user.id != interaction.user.id) return Errors.youNotAuthor(int, 'leaderboard') // Отсеиваем лишних

                let id  = int.customId // Смотрим ID кнопки
                embed.fields = [] // Обнуляем поля

                switch (id) { // В зависимости от ID выбираем нужную страницу
                    case 'ld_first': {
                        page = 0
                        break
                    }
                    case 'ld_prev': {
                        page = page-1 < 0 ? 0 : page-1
                        break
                    }
                    case 'ld_me': {
                        page = Math.floor((lb.slice().map(elm => elm.memberID).indexOf(interaction.user.id))/3)
                        break
                    }
                    case 'ld_next': {
                        page = page+1 >= pages.length ? pages.length-1 : page+1
                        break
                    }
                    case 'ld_last': {
                        page = pages.length-1
                        break
                    }
                }

                // Отправляем апдэйт сообщения
                await int.update({
                    embeds: [embed.addFields(pages[page]).setFooter(this.client.footerMaker(interaction, `Страница: ${page+1}/${pages.length}`))],
                    components: [row]
                })
            })
        }
    }
}

