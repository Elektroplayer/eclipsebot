// eslint-disable-next-line no-unused-vars
import { MessageEmbed, CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import Errors from '../structures/Errors.js'

export default class PollCommand extends Command {
    info = {
        description: 'Создание опросов',
        name: 'poll',
        options: [
            {
                name: 'theme',
                description: 'Тема опроса',
                type: 'STRING',
                required: false,
            },{
                name: 'options',
                description: 'Варианты ответа (перечисляются через запятую)',
                type: 'STRING',
                required: false,
            }
        ]
    }

    help = {
        category: 'Общее',
        arguments: [
            '**<без аргументов>** - Создать голосование без темы и вариантов.',
            '`theme` - Задать тему.',
            '`options` - Задать варианты ответов.'
        ],
        using: [
            '**/poll** - Создаст опрос с темой "?" и вариантами ✅ и ❎.',
            '**/poll** `theme: P.S. Нужно придумать норм тему` - Создаст опрос с заданной темой и вариантами ✅ и ❎.',
            '**/poll** `options: На полу, На кровати, На потолке` - Создаст опрос без темы и с иными вариантами ответа.',
            '**/poll** `theme: Какие макароны самые вкусные` `options: Спагетти, Фузилли, Фарфалле, Вермишель` - Создаст опрос с заданной темой и иными вариантами ответа.'
        ]
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {

        if(!interaction.channel.permissionsFor(this.client.user).has('ADD_REACTIONS')) return Errors.falsePerms(interaction, 'добавлять реакции')

        //  Устанавливаем удобные переменные
        let theme    = interaction.options._hoistedOptions.find(elm => elm.name == 'theme')?.value || ''
        let options  = interaction.options._hoistedOptions.find(elm => elm.name == 'options')?.value || ''

        let embed  = new MessageEmbed() //  Делаем embed сейчас, чтобы не прописывать всё это потом
        .setColor(this.client.config.colors.default)
        .setFooter({text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) || interaction.user.defaultAvatarURL})

        let optionsArray = options.split(/,\s*/g).filter(elm => elm.trim()) //  Получаем и очищаем массив опций (они разделяются через запятую и неважно сколько будет пробелов)

        if(!theme && !optionsArray[0]) {
            await interaction.channel.send({embeds: [embed.setTitle('?')]}) //  Если по сути ничего не дали, просто ставим ? и заканчиваем
            .then(async msg => {
                await msg.react('✅')
                await msg.react('❎')
            }) //  Ставим реакции

            return Errors.success(interaction, 'Готово!') //  Ответ на interaction
        }

        if(theme.length>=256) return Errors.falseArgs(interaction,'Тема не может быть длиннее 256 символов!') //  Ограничение Discord

        embed.setTitle(theme) //  Устанавливаем тему

        if(!optionsArray[0]) {
            await interaction.channel.send({embeds: [embed]}) //  Если у нас нет опций, то просто отправляем тему с галочками
            .then(async msg => {
                await msg.react('✅')
                await msg.react('❎')
            }) //  Ставим реакции

            return Errors.success(interaction, 'Готово!') //  Ответ на interaction
        }

        if(optionsArray.length>10) return Errors.falseArgs(interaction,'Не больше 10 вариантов!') //  Реакций всего лишь 10...

        let endText = '' // Конечный текст, который мы вставим в setDescription

        optionsArray.forEach( (elm , i) => {
            endText += `**${i+1}.** ${elm}\n`
        })

        if(endText.length > 4096) return Errors.falseArgs(interaction, 'Варианты не могут быть длиннее 4096 символов') //  Ещё одно ограничение Discord

        embed.setDescription(endText) // Вставляем текст

        interaction.channel.send({embeds: [embed]}) //  Отправляем
        .then(async msg=> { //  Тут установка реакций по сложнее будет
            for(let i = 0; i< optionsArray.length; i++) await msg.react(['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'][i])
        })

        return Errors.success(interaction, 'Готово!') //  Ответ на interaction
    }
}

