// eslint-disable-next-line no-unused-vars
import { MessageEmbed, CommandInteraction } from 'discord.js'
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

export default class LevelCommand extends Command {
    info = {
        description: 'Просмотр уровня',
        name: 'level',
        options: [
            {
                name: 'user',
                description: 'Если хочешь узнать уровень другого человека',
                type: 'USER',
                required: false
            }
        ]
    }

    help = {
        category: 'Уровни',
        arguments: [
            '**<без аргументов>** - Показать свой уровень, опыт и место.',
            '`user` - Показать чужой уровень, опыт и место.'
        ],
        using: []
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        let serverSettings = await LevelsServer.findOne({guildID: interaction.guild.id}).exec()
        if(!serverSettings || !serverSettings.enabled) return Errors.noLevels(interaction)

        let member = interaction.options._hoistedOptions[0]?.member ?? interaction.member

        LevelsMember.findOne({guildID: interaction.guild.id, memberID: member.user.id}, async (err,set) => {
            if(err) console.log(err)

            let lb = await LevelsMember.find({guildID: interaction.guild.id}).sort([['xp', 'descending']]).exec()
            lb.filter(elm => interaction.guild.members.cache.get(elm.memberID))

            let place = lb.slice().map(elm => elm.memberID).indexOf(member.user.id)
            let lInfo = getLevel(set?.xp ?? 0)
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Уровень юзера ' + member.user.tag)
                    .setColor(this.client.config.colors.default)
                    .setDescription(
                        `Уровень: \`${lInfo.level}\`\n` +
                        `Опыт: \`${lInfo.xp} / ${f(lInfo.level)}xp\`\n` +
                        `\`${f(lInfo.level) - lInfo.xp}xp осталось\`\n` +
                        `Всего опыта: \`${set?.xp ?? 0}xp\``
                    )
                    .setFooter({text: this.client.footerMaker(interaction, place != -1 ? `Место в рейтинге: ${place+1}/${lb.length}` : 'Нет в базе данных')})
                ],
            })
        })
    }
}

