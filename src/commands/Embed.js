// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import Errors from '../structures/Errors.js'

export default class embedCommand extends Command {
    info = {
        description: 'Создание embed сообщений!',
        name: 'embed',
        options: [{
            name: 'json',
            description: 'Embed в виде JSON',
            type: 'STRING',
            required: true,
        }]
    }

    help = {
        category: 'Общее',
        arguments: [
            '`json` - JSON нужного embed\'a. Составить можно на [discohook.org](https://clck.ru/e793B).'
        ],
        using: [
            '**/embed** `json: [{"title": "Угу", "description": "Это работает!", "color": "#cccccc"}]` - Отправит этот embed.'
        ]
    }

    /**
     * @param {CommandInteraction} interaction
    */
    async exec(interaction) {
        let arg = interaction.options._hoistedOptions[0].value // Предоставленный аргумент

        if(!arg) return Errors.custom(interaction,'JSON не найден!')

        let stringToParse = `{"obj":[${arg.replace(/(```(\w+)?)/g, '').trim()}]}` //  Это то, что мы будем парсить. Выглядит сложно, но оно работает и мы его не трогаем)
        
        try { //  Попыточка
            let json = JSON.parse(stringToParse).obj[0]
            //console.log(json)
            
            interaction.channel.send({
                embeds: Array.isArray(json) ? json : [json],
                disableMentions: 'all'
            }).catch((err) => Errors.custom(interaction,'Ошибка! Перепроверь свой embed!', `Подробно: \`${err}\``) )
            .then(() => {
                if(!interaction.replied) Errors.success(interaction,'Успешно!')
            })

        } catch (err) { // Если не получилось, значит что-то не так или с json или с ещё чем то. В общем, просим перепровить
            return Errors.custom(interaction,'Ошибка! Перепроверь свой embed!', `Подробно: \`${err}\``)
        }
    }
}