import DefaultClassSettings from './BaseSettingsClass.js'
import PrivateVoices from '../../models/PrivateVoices.js'
import { MessageEmbed } from 'discord.js'
import { format } from '../../structures/Utils.js'

export default class PrivateVoicesSettings extends DefaultClassSettings {
    async Init () {
        this.set = await PrivateVoices.findOne({guildID: this.guildID}).exec()
    }

    enabled () {
        if(!this.value) return this.curValEmbed(this.key, this.set?.enabled || 'false')

        this.value = this.value.toLowerCase()
        if(!['true', 'false'].includes(this.value)) return this.falseValue()

        if(!this.set) {
            this.autosetVal('privateVoices.template', '[+] {{TAG}}')

            let newPV = new PrivateVoices({ enabled: this.value == 'true', guildID: this.guildID })
            newPV.save().catch(err => console.log(err))
        } else {
            this.set.enabled = this.value == 'true'
            this.set.save().catch(err => console.log(err))
        }

        this.Success(this.key, this.value)

        if(!this.interaction.guild.me.permissions.has('MANAGE_CHANNELS')) this.embeds.push(new MessageEmbed()
        .setColor(this.client.config.colors.warnOrange)
        .setTitle('У меня нет права на создание каналов'))

        if(!this.interaction.guild.me.permissions.has('MOVE_MEMBERS')) this.embeds.push(new MessageEmbed()
        .setColor(this.client.config.colors.warnOrange)
        .setTitle('У меня нет права на перемещение участников'))

        this.sendEmbeds()
    }

    channelid () {
        if(!this.value) return this.curValEmbed(this.key, this.set?.channelID || 'Не установлено')

        if(!this.interaction.guild.channels.cache.get(this.value)) return this.falseValue('Предоставленного канала не существует')
        if(this.interaction.guild.channels.cache.get(this.value).type !== 'GUILD_VOICE') return this.falseValue('Предоставленный канал не является голосовым')
        if(!this.interaction.guild.channels.cache.get(this.value).parent) return this.falseValue( 'Предоставленный канал не в категории')

        let channelID = this.interaction.guild.channels.cache.get(this.value).id

        if(!this.set) {
            this.autosetVal('privateVoices.enabled', 'true')
            this.autosetVal('privateVoices.template', '[+] {{TAG}}')

            let newPV = new PrivateVoices({ guildID: this.guildID, channelID })
            newPV.save().catch(err => console.log(err))
        } else {
            if(!this.set.enabled) {
                this.set.enabled = true

                this.autosetVal('privateVoices.enabled', 'true')
            }

            this.set.channelID = channelID
            this.set.save().catch(err => console.log(err))
        }

        if(!this.interaction.guild.me.permissions.has('MANAGE_CHANNELS')) this.embeds.push(new MessageEmbed()
        .setColor(this.client.config.colors.warnOrange)
        .setTitle('У меня нет права на создание каналов'))

        if(!this.interaction.guild.me.permissions.has('MOVE_MEMBERS')) this.embeds.push(new MessageEmbed()
        .setColor(this.client.config.colors.warnOrange)
        .setTitle('У меня нет права на перемещение участников'))

        this.Success(this.key, this.value)
        this.sendEmbeds()
    }

    template () {
        if(!this.value) return this.curValEmbed(this.key, this.set?.template || 'Не установлено')

        if(format(this.value, {
            USERNAME: '11111111111111111111111111111111',
            NICKNAME: '11111111111111111111111111111111',
            TAG: '11111111111111111111111111111111#1111'
        }).length > 100 ) return this.falseValue('Слишком большой шаблон')

        if(!this.set) {
            this.autosetVal('privateVoices.enabled', 'true')

            let newPV = new PrivateVoices({ guildID: this.guildID, template: this.value })
            newPV.save().catch(err => console.log(err))

            this.success(this.key, this.value)
        } else {
            if(!this.set.enabled) {
                this.set.enabled = true

                this.autosetVal('privateVoices.enabled', 'true')
            }

            this.set.template = this.value
            this.set.save().catch(err => console.log(err))

            this.success(this.key, this.value)
        }

        if(!this.interaction.guild.me.permissions.has('MANAGE_CHANNELS')) this.embeds.push(new MessageEmbed()
        .setColor(this.client.config.colors.warnOrange)
        .setTitle('У меня нет права на создание каналов'))

        if(!this.interaction.guild.me.permissions.has('MOVE_MEMBERS')) this.embeds.push(new MessageEmbed()
        .setColor(this.client.config.colors.warnOrange)
        .setTitle('У меня нет права на перемещение участников'))

        this.sendEmbeds()
    }
}