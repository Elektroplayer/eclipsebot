// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import LevelsMember from '../models/LevelsMember.js'
import LevelsServer from '../models/LevelsServer.js'
import Errors from '../structures/Errors.js'

export default class PingCommand extends Command {
    info = {
        description: 'Передать свой опыт',
        name: 'give',
        options: [{
            name: 'amount',
            description: 'Сколько передать',
            type: 'NUMBER',
            required: true,
        },{
            name: 'user',
            description: 'Кому передать',
            type: 'USER',
            required: true,
        }]
    }

    help = {
        category: 'Уровни',
        arguments: [
            '`amount` - Сколько передавать XP.',
            '`user` - Кому передавать ваш XP.'
        ],
        using: [
            '**/give** `amount: 100` `user: RandomUser#1234` - Передаст 100xp человеку RandomUser#1234.'
        ]
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {

        //  Проверяем включены ли уровни на сервере и разрешена ли их передача
        let serverSettings = await LevelsServer.findOne({guildID: interaction.guild.id}).exec()
        if(!serverSettings || !serverSettings.enabled) return Errors.noLevels(interaction)
        if(!serverSettings.transfer) return Errors.custom(interaction, 'На этом сервере запрещено передать опыт')

        //  Устанавливаем пару переменных для упрощения жизни
        let sender    = interaction.member
        let recipient = interaction.options._hoistedOptions.find(elm => elm.name == 'user')?.member
        let amount    = Math.ceil(interaction.options._hoistedOptions.find(elm => elm.name == 'amount')?.value) //  За одно избавляемся от дроби

        if(recipient.user.id == sender.user.id) return Errors.custom(interaction, 'Шиза?)')
        if(amount<= 0) return Errors.falseArgs(interaction, 'Сумма отправки должна быть больше чем 0')

        //  Подключаемся к БД и начинаем химичить уже там

        LevelsMember.findOne({guildID: interaction.guild.id, memberID: sender.user.id}, async (err, senderXP) => {
            if(err) console.log(err)
            if(!senderXP || senderXP.xp < amount) return Errors.custom(interaction, 'Недостаточно опыта')

            LevelsMember.findOne({guildID: interaction.guild.id, memberID: recipient.user.id}, async (err, recipientXP) => {
                if(err) console.log(err)
                if(recipient.user.bot) return Errors.custom(interaction, 'Нельзя отправлять уровень ботам')

                if(!recipientXP) {
                    let newXP =  new LevelsMember({
                        guildID: interaction.guild.id,
                        memberID: recipient.user.id,
                        xp: amount
                    })

                    newXP.save().catch(err => console.log(err))
                } else {
                    recipientXP.xp += amount
                    recipientXP.save().catch(err => console.log(err))
                }

                senderXP.xp -= amount
                senderXP.save().catch(err => console.log(err))

                Errors.success(interaction, `\`${amount}xp\` успешно передано \`${recipient.user.tag}\``)
            })
        })
    }
}

