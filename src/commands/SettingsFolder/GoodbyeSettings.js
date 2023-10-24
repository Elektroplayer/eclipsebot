import DefaultClassSettings from './BaseSettingsClass.js'
import Messages from '../../models/Messages.js'
import { MessageEmbed } from 'discord.js'
import { format, formatObject } from '../../structures/Utils.js'

export default class GoodbyeSettings extends DefaultClassSettings {
    async Init () {
        this.set = await Messages.findOne({guildID: this.guildID, type: 'Goodbye'}).exec()
    }

    enabled () {
        if(!this.value) return this.curValEmbed(this.key, this.set?.enabled || 'false')

        this.value = this.value.toLowerCase()
        
        if(!['true', 'false'].includes(this.value)) return this.falseValue()

        if(!this.set) {
            this.autosetVal('goodbye.message.content', 'Прощай, {{USERNAME}}')

            let newMSG = new Messages({
                guildID: this.guildID,
                type: 'Goodbye',
                enabled: this.value == 'true',
                message: {
                    content: 'Прощай, {{USERNAME}}'
                }
            })

            newMSG.save().catch(err => console.log(err))
        } else {
            this.set.enabled = this.value == 'true'
            this.set.save().catch(err => console.log(err))
        }
        
        this.Success(this.key, this.value)
        this.sendEmbeds()
    }

    channelid () {
        if(!this.value) {
            this.curValEmbed(this.key, this.set?.channelID || '*Не установлено*', false)

            if(
                this.set?.channelID && !(
                    this.interaction.guild.channels.cache.get(this.set.channelID).permissionsFor(this.client.user).has('SEND_MESSAGES') &&
                    this.interaction.guild.channels.cache.get(this.set.channelID).permissionsFor(this.client.user).has('VIEW_CHANNEL')
                )
            ) this.embeds.push(new MessageEmbed()
            .setColor(this.client.config.colors.warnOrange)
            .setTitle('У меня не достаточно прав на отправку сообщений в этот канал'))

            if(
                this.set?.channelID && 
                this.set?.message.embeds?.length > 0 &&
                !this.interaction.guild.channels.cache.get(this.set.channelID).permissionsFor(this.client.user).has('EMBED_LINKS')
            ) this.embeds.push(new MessageEmbed()
            .setColor(this.client.config.colors.warnOrange)
            .setTitle('У меня не достаточно прав на отправку embed-сообщений в этот канал'))

            return this.sendEmbeds()
        }

        if(!this.interaction.guild.channels.cache.get(this.value)) return this.falseValue('Предоставленного канала не существует')
        if(this.interaction.guild.channels.cache.get(this.value).type !== 'GUILD_TEXT') return this.falseValue('Предоставленный канал не является текстовым')

        if(!this.set) {
            this.autosetVal('goodbye.enabled', 'true')
            this.autosetVal('goodbye.message.content', 'Прощай, {{USERNAME}}')

            let newMSG = new Messages({
                guildID: this.guildID,
                channelID: this.value,
                type: 'Goodbye',
                message: {
                    content: 'Прощай, {{USERNAME}}'
                }
            })

            newMSG.save().catch(err => console.log(err))
        } else {
            if(!this.set.enabled) {
                this.set.enabled = true

                this.autosetVal('goodbye.enabled', 'true')
            }

            this.set.channelID = this.value
            this.set.save().catch(err => console.log(err))
        }

        if(!(
            this.interaction.guild.channels.cache.get(this.value).permissionsFor(this.client.user).has('SEND_MESSAGES') &&
            this.interaction.guild.channels.cache.get(this.value).permissionsFor(this.client.user).has('VIEW_CHANNEL')
        )) this.embeds.push(new MessageEmbed()
        .setColor(this.client.config.colors.warnOrange)
        .setTitle('У меня не достаточно прав на отправку сообщений в этот канал'))

        if(
            this.set?.embed?.length > 0 &&
            this.interaction.guild.channels.cache.get(this.value).permissionsFor(this.client.user).has('EMBED_LINKS')
        ) this.embeds.push(new MessageEmbed()
        .setColor(this.client.config.colors.warnOrange)
        .setTitle('У меня не достаточно прав на отправку embed-сообщений в этот канал'))

        this.Success(this.key, this.value)

        this.sendEmbeds()
    }

    message() {
        if(this.keys[2] == 'content') return this.messageContent()
        if(this.keys[2] == 'embed') return this.messageEmbed()
        if(this.keys[2] && !['content', 'embed'].includes(this.keys[2])) return this.unknownKey()

        let msg = this.set.message

        if(msg.content == null && msg.embeds.length == 0) return this.Error('Сообщение не указано')

        this.interaction.reply(formatObject(this.set.message, (string) => {
            return format(string, {
                USERNAME: this.interaction.user.username,
                TAG: this.interaction.user.tag,
                MENTION: `<@!${this.interaction.member.id}>`,
                GUILDNAME: this.interaction.guild.name,
                COUNT: this.interaction.guild.members.cache.size
            })
        }))
    }

    messageContent () {
        if(!this.value) return this.curValEmbed(this.key, this.set?.message.content || '*Не установлено*')

        if(format(this.value, { // один один один один один один
            USERNAME: '11111111111111111111111111111111',
            TAG: '11111111111111111111111111111111#1111',
            MENTION: '<@111111111111111111>',
            GUILDNAME: '1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
            COUNT: '11111'
        }).length > 2000 ) return this.falseValue('Слишком большое приветствие')

        if(!this.set) {
            this.autosetVal('goodbye.enabled', 'true')

            let newMSG = new Messages({
                guildID: this.guildID,
                type: 'Goodbye',
                enabled: true,
                message: {
                    content: this.value == '{{NONE}}' ? null : this.value
                }
            })
            newMSG.save().catch(err => console.log(err))
        } else {
            if(!this.set.enabled) {
                this.set.enabled = true

                this.autosetVal('goodbye.enabled', 'true')
            }

            this.set.message.content = (this.value == '{{NONE}}' ? null : this.value)
            this.set.save().catch(err => console.log(err))
        }

        this.Success(this.key, this.value)
        this.sendEmbeds()
    }

    async messageEmbed () {
        if(!this.value) return this.curValEmbed(this.key, (this.set?.message.embeds.length && this.set?.message.embeds.length > 0) ? JSON.stringify(this.set?.message.embeds) : '*Не установлено*')

        if(this.value == '{{NONE}}') {
            if(!this.set) {
                this.autosetVal('goodbye.enabled', 'true')
                this.autosetVal('goodbye.message.content', 'Прощай, {{USERNAME}}')

                let newMSG = new Messages({
                    guildID: this.guildID,
                    type: 'Goodbye',
                    message: {
                        content: 'Прощай, {{USERNAME}}'
                    }
                })
                newMSG.save().catch(err => console.log(err))                
            } else {
                if(!this.set.enabled) {
                    this.set.enabled = true

                    this.autosetVal('goodbye.enabled', 'true')
                }

                this.set.message.embeds = []
                this.set.save().catch(err => console.log(err))
            }

            this.Success(this.key, this.value)
            this.sendEmbeds()
        }

        let stringToParse = `{"obj":[${this.value.replace(/(```(\w+)?)/g, '').trim()}]}` //  Это то, что мы будем парсить. Выглядит сложно, но оно работает и мы его не трогаем)        

        let stringToParseAndSend = format(stringToParse, {
            USERNAME: '11111111111111111111111111111111',
            TAG: '11111111111111111111111111111111#1111',
            MENTION: '<@111111111111111111>',
            GUILDNAME: '1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
            COUNT: '11111'
        })
        
        try {
            let json = JSON.parse(stringToParseAndSend).obj[0]
            let savingJson = JSON.parse(stringToParse).obj[0]

            let errors = false // Нахожусь в поисках лучшего способа
            await this.interaction.channel.send({
                embeds: Array.isArray(json) ? json : [json],
                disableMentions: 'all'
            }).catch(err => {
                errors = true
                return this.Error('Ошибка! Перепроверь свой embed!', `Подробно: \`${err}\``)
            })
    
            if(errors) return
    
            if(!this.set) {
                this.autosetVal('goodbye.enabled', 'true')
    
                let newMSG = new Messages({
                    guildID: this.guildID,
                    type: 'Goodbye',
                    enabled: true,
                    message: {
                        content: null,
                        embeds: Array.isArray(savingJson) ? savingJson : [savingJson]
                    }
                })
                newMSG.save().catch(err => console.log(err))
            } else {
                if(!this.set.enabled) {
                    this.set.enabled = true
    
                    this.autosetVal('goodbye.enabled', 'true')
                }
    
                this.set.message.embeds = Array.isArray(savingJson) ? savingJson : [savingJson]
                this.set.save().catch(err => console.log(err))
            }
    
            this.Success(this.key, this.value)
            this.sendEmbeds()
        } catch (err) {
            return this.Error('Ошибка! Перепроверь свой embed!', `Подробно: \`${err}\``)
        }
    }
}
