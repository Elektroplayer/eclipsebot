// eslint-disable-next-line no-unused-vars
import { MessageEmbed, CommandInteraction } from 'discord.js'
import CONFIG from '../../config.js'

export default {
    /**
     * Создание кастомной ошибки
     * @param {CommandInteraction} interaction 
     * @param {string} title 
     * @param {string} description 
     * @param {boolean} ephemeral 
     * @returns 
     */
    custom: (interaction, title, description, ephemeral = true) => {
        let emb = new MessageEmbed()
        .setColor(CONFIG.colors.errorRed)
        .setTitle(title)

        if(description) emb.setDescription(description)
        
        return interaction.reply({
            embeds: [emb],
            ephemeral
        })
    },

    /**
     * Создание кастомной ворнинга
     * @param {CommandInteraction} interaction 
     * @param {string} title 
     * @param {string} description 
     * @param {boolean} ephemeral 
     * @returns 
     */
    warning: (interaction, title, description, ephemeral = true) => {
        let emb = new MessageEmbed().setColor(CONFIG.colors.warnOrange)
        .setTitle(title)

        if(description) emb.setDescription(description)
        
        return interaction.reply({
            embeds: [emb],
            ephemeral
        })
    },

    /**
     * Если всё хорошо
     * @param {CommandInteraction} interaction 
     * @param {string} title 
     * @param {string} description 
     * @param {boolean} ephemeral 
     * @returns 
     */
    success: (interaction, title, description, ephemeral = true) => {
        let emb = new MessageEmbed().setColor(CONFIG.colors.successGreen)
        .setTitle(title)

        if(description) emb.setDescription(description)
        
        return interaction.reply({
            embeds: [emb],
            ephemeral
        })
    },

    /**
     * Ошибка отключенных уровней
     * @param {CommandInteraction} interaction 
     */
    noLevels: (interaction) => {
        let emb = new MessageEmbed().setColor(CONFIG.colors.errorRed)
        .setTitle('На этом сервере выключены уровни')
        //.setDescription('Попроси администратора их включить: `/settings levels enabled true`')

        return interaction.reply({
            embeds: [emb],
            ephemeral: true
        })
    },

    /**
     * Ответ человеку, за взаимодействие не со своим Interaction
     * @param {CommandInteraction} interaction 
     * @param {string} command
     */
    youNotAuthor: (interaction, command) => {
        let emb = new MessageEmbed().setColor(CONFIG.colors.errorRed)
        .setTitle('Ты не автор сообщения!')
        .setDescription(`Напиши \`/${command}\` сам.`)

        return interaction.reply({
            embeds: [emb],
            ephemeral: true
        })
    },

    /**
     * Если человек запутался в аргументах.
     * Текст: Предоставлены неверные аргументы!
     * @param {CommandInteraction} interaction 
     * @param {string} desc
     */
    falseArgs: (interaction, desc) => {
        let emb = new MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle('Предоставлены неверные аргументы!')
        if(desc) emb.setDescription(desc)

        return interaction.reply({
            embeds: [emb],
            ephemeral: true
        })
    },

    /**
     * При отсутствии нужных прав
     * Текст: У тебя не достаточно прав!
     * @param {CommandInteraction} interaction 
     * @param {string} perms
     */
    falsePerms: (interaction, perms) => {
        let emb = new MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle('У тебя не достаточно прав!')
        if(perms) emb.setDescription(`Требуемые права: \`${perms}\``)

        return interaction.reply({
            embeds: [emb],
            ephemeral: true
        })
    },

    /**
     * Если введено неверное значение для ключа.
     * Текст: Введено неправильное значение для ключа!
     * @param {CommandInteraction} interaction 
     */
    falseValue: (interaction) => {
        let emb = new MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle('Введено неправильное значение для ключа!')

        return interaction.reply({
            embeds: [emb],
            ephemeral: true
        })
    }
}