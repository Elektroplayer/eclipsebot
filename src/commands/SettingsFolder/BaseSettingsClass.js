// eslint-disable-next-line no-unused-vars
import { CommandInteraction, MessageEmbed } from 'discord.js'

export default class Settings {
    /**
     * @param {CommandInteraction} interaction
     */
    constructor(interaction, client) {
        this.interaction  = interaction
        this.key          = interaction.options._hoistedOptions.find(x=>x.name=='key').value
        this.value        = interaction.options._hoistedOptions.find(x=>x.name=='value')?.value
        this.guildID      = interaction.guild.id
        this.keys         = this.key.toLowerCase().split('.')
        this.client       = client
        this.embeds       = []
    }

    Init() {
        console.log('Ты забыл прописать тут настройку')
    }

    // WARNING: НИ В КОЕМ СЛУЧАЕ НЕ ДОБАВЛЯЙ ФУНКЦИИ, КОТОРЫЕ НЕ ИМЕЮТ БОЛЬШОЙ БУКВЫ, ЕСЛИ НЕ ХОЧЕШЬ, ЧТОБЫ ЕЮ МОГ ВОСПОЛЬЗОВАТЬСЯ ПОЛЬЗОВАТЕЛЬ!

    curValEmbed (key, value, send = true) {
        let emb = new MessageEmbed()
        .setTitle(`Текущее значение ключа \`${key}\``)
        .setColor(this.client.config.colors.default)
        .setDescription(`${value}`)

        if(send) {
            this.embeds = [emb]
            return this.sendEmbeds()
        } else this.embeds.push(emb)
    }

    unknownKey () {
        this.embeds = [
            new MessageEmbed().setTitle('Неизвестный ключ')
            .setColor(this.client.config.colors.errorRed)
        ]
        return this.sendEmbeds()
    }

    autosetVal (key, value) {
        this.embeds.push(
            new MessageEmbed()
            .setColor(this.client.config.colors.warnOrange)
            .setTitle(`Значение ключа \`${key}\` изменено автоматически на`)
            .setDescription(`\`${value}\``)
        )
    }

    Success(key, value, does = 'присвоено') {
        this.embeds.push(
            new MessageEmbed()
            .setColor(this.client.config.colors.successGreen)
            .setTitle(`Ключу \`${key}\` успешно ${does} значение`)
            .setDescription(`\`${value}\``)
        )
    }

    falseValue(desc = undefined) {
        let emb = new MessageEmbed()
        .setColor(this.client.config.colors.errorRed)
        .setTitle('Введено неправильное значение для ключа!')

        if(desc) emb.setDescription(desc)

        this.embeds = [emb]
        this.sendEmbeds()
    }

    Error(title, desc) {
        let emb = new MessageEmbed()
        .setColor(this.client.config.colors.errorRed)
        .setTitle(title)

        if(desc) emb.setDescription(desc)

        this.embeds = [emb]
        this.sendEmbeds()
    }

    sendEmbeds() {
        return this.interaction.reply({embeds: this.embeds})
    }
}