import DefaultClassSettings from './BaseSettingsClass.js'
import LevelsServer from '../../models/LevelsServer.js'
import discord from 'discord.js'
import { format, formatObject } from '../../structures/Utils.js'

export default class LevelsSettings extends DefaultClassSettings {
    async Init () {
        this.set = await LevelsServer.findOne({guildID: this.guildID}).exec()
    }

    noInList() {
        return this.Error('Этого объекта нет в списке')
    }

    hasInList() {
        return this.Error('Этот объект уже есть в списке')
    }

    enabled () {
        if(!this.value) return this.curValEmbed(this.key, this.set?.enabled || 'false')

        this.value = this.value.toLowerCase()
        if(!['true', 'false'].includes(this.value)) return this.falseValue()

        if(!this.set) {
            this.autosetVal('levels.transfer', 'true')
            this.autosetVal('levels.onNewLevel.mode', 'msg')
            this.autosetVal('levels.onNewLevel.message.content', '**{{MENTION}}**, поздравляю с повышением до **{{LEVEL}}** уровня!')
            this.autosetVal('levels.onNewLevel.messageDeleteTimeout', '5')

            let newLVL = new LevelsServer({ enabled: this.value == 'true', guildID: this.guildID })
            newLVL.save().catch(err => console.log(err))
        } else {
            this.set.enabled = this.value == 'true'
            this.set.save().catch(err => console.log(err))
        }

        this.Success(this.key, this.value)

        this.sendEmbeds()
    }

    transfer() {
        if(!this.value) return this.curValEmbed(this.key, this.set?.transfer || 'false')

        this.value = this.value.toLowerCase()
        if(!['true', 'false'].includes(this.value)) return this.falseValue()

        if(!this.set) {
            this.autosetVal('levels.enabled', 'true')
            this.autosetVal('levels.onNewLevel.mode', 'msg')
            this.autosetVal('levels.onNewLevel.message.content', '**{{MENTION}}**, поздравляю с повышением до **{{LEVEL}}** уровня!')
            this.autosetVal('levels.onNewLevel.messageDeleteTimeout', '5')

            let newLVL = new LevelsServer({ transfer: this.value == 'true', guildID: this.guildID })
            newLVL.save().catch(err => console.log(err))
        } else {
            if(!this.set.enabled) {
                this.set.enabled = true

                this.autosetVal('levels.enabled', 'true')
            }

            this.set.transfer = this.value == 'true'
            this.set.save().catch(err => console.log(err))
        }

        this.Success(this.key, this.value)

        this.sendEmbeds()
    }

    exceptions() {
        if(!this.keys[3]) return this.curValEmbed(this.key, this.set?.exceptions[this.keys[2]]?.join(', ') || '*Не установлено*' )
        
        let exContext // exception context - контекст исключений
        if(!this.keys[2] || !this.set.exceptions[this.keys[2]]) return this.unknownKey()
        else exContext = this.set.exceptions[this.keys[2]]

        if(!['add', 'remove'].includes(this.keys[3])) return this.falseValue()
        
        // Тестирование

        if(this.keys[2] == 'roles' && !this.interaction.guild.roles.cache.get(this.value)) return this.falseValue('Предоставленной роли не существует')
        if(this.keys[2] == 'channels') {
            if(!this.interaction.guild.channels.cache.get(this.value)) return this.falseValue('Предоставленного канала не существует')
            if(this.interaction.guild.channels.cache.get(this.value).type !== 'GUILD_TEXT') return this.falseValue('Предоставленный канала не является текстовым')
        }

        // Исполнение

        if(!this.set) {
            if(this.keys[3] == 'remove') return this.noInList()
            
            this.autosetVal('levels.enabled', 'true')
            this.autosetVal('levels.transfer', 'true')
            this.autosetVal('levels.onNewLevel.mode', 'msg')
            this.autosetVal('levels.onNewLevel.message.content', '**{{MENTION}}**, поздравляю с повышением до **{{LEVEL}}** уровня!')
            this.autosetVal('levels.onNewLevel.messageDeleteTimeout', '5')

            let exObj = {
                roles: [],
                channels: []
            }

            exObj[this.keys[2].toLowerCase()].push(this.value)

            let newLVL = new LevelsServer({
                guildID: this.guildID, 
                exceptions: exObj
            })

            newLVL.save().catch(err => console.log(err))
            this.Success(this.key, this.value, 'добавлено')
        } else {
            if(!this.set.enabled) {
                this.set.enabled = true

                this.autosetVal('levels.enabled', 'true')
            }

            if(this.keys[3] == 'add') {
                if(exContext.includes(this.value)) return this.hasInList()
                
                if(!this.set.enabled) {
                    this.set.enabled = true
    
                    this.autosetVal('levels.enabled', 'true')
                }

                exContext.push(this.value)

                this.Success(this.key, this.value, 'добавлено')
            } else {
                if(!exContext.includes(this.value)) return this.noInList()
                
                if(!this.set.enabled) {
                    this.set.enabled = true
    
                    this.autosetVal('levels.enabled', 'true')
                }

                exContext.splice(exContext.indexOf(this.value), 1)
                this.Success(this.key, this.value, 'убрано')
            }

            this.set.save().catch(err => console.log(err))
        }

        this.sendEmbeds()
    }

    onnewlevel() {
        switch(this.keys[2]) {
            case 'mode': this.ONLMode(); break

            case 'message': this.ONLMessage(); break

            case 'messagedeletetimeout': this.ONLMessageDeleteTimeout(); break

            case 'reaction': this.ONLReact(); break

            default: this.unknownKey(); break
        }
    }

    ONLMode() {
        if(!this.value) {
            if(!this.set || this.set.onNewLevel.mode.length == 0) return this.curValEmbed(this.key, 'null')
            if(
                this.set.onNewLevel.mode.includes('msg') &&
                this.set.onNewLevel.mode.includes('react')
            ) return this.curValEmbed(this.key, 'all')
            if(this.set.onNewLevel.mode.includes('msg')) return this.curValEmbed(this.key, 'msg')
            if(this.set.onNewLevel.mode.includes('react')) return this.curValEmbed(this.key, 'react')
        }

        let dict = {
            'null': [],
            'msg': ['msg'],
            'react': ['react'],
            'all': ['msg', 'react']
        }

        if(!dict[this.value]) return this.falseValue()

        if(!this.set) {
            this.autosetVal('levels.enabled', 'true')
            this.autosetVal('levels.transfer', 'true')
            this.autosetVal('levels.onNewLevel.message.content', '**{{MENTION}}**, поздравляю с повышением до **{{LEVEL}}** уровня!')
            this.autosetVal('levels.onNewLevel.messageDeleteTimeout', '5')

            let newLVL = new LevelsServer({
                guildID: this.guildID,
                onNewLevel: {
                    mode: dict[this.value]
                }
            })

            newLVL.save().catch(err => console.log(err))
        } else {
            if(!this.set.enabled) {
                this.set.enabled = true

                this.autosetVal('levels.enabled', 'true')
            }

            this.set.onNewLevel.mode = dict[this.value]
            this.set.save().catch(err => console.log(err))
        }

        this.Success(this.key, this.value)
        this.sendEmbeds()
    }
    
    ONLMessageDeleteTimeout() {
        if(!this.value) return this.curValEmbed(this.key, this.set?.onNewLevel.deleteTimeout || '*Не установлено*')

        if(!(this.value == +this.value)) return this.falseValue('Значение должно быть цифрой') // Тестирование на цифру. Я хотел сюда засунуть регулярку, но этот способ мне показался наиболее простым и действенным

        this.value = parseFloat(this.value)

        if(this.value < 0 || this.value > 180) return this.falseValue('Значение должно быть в диапазоне от 0 до 180')

        if(!this.set) {
            this.autosetVal('levels.enabled', 'true')
            this.autosetVal('levels.transfer', 'true')
            this.autosetVal('levels.onNewLevel.mode', 'msg')
            this.autosetVal('levels.onNewLevel.message.content', '**{{MENTION}}**, поздравляю с повышением до **{{LEVEL}}** уровня!')

            let newLVL = new LevelsServer({ guildID: this.guildID, onNewLevel: { deleteTimeout: this.value } })
            newLVL.save().catch(err => console.log(err))
        } else {
            if(!this.set.enabled) {
                this.set.enabled = true

                this.autosetVal('levels.enabled', 'true')
            }

            this.set.onNewLevel.deleteTimeout = this.value
            this.set.save().catch(err => console.log(err))
        }

        this.Success(this.key, this.value)
        this.sendEmbeds()
    }

    ONLMessage() {
        if(this.keys[3] == 'content') return this.ONLMessageContent()
        if(this.keys[3] == 'embed') return this.ONLMessageEmbed()
        if(this.keys[3] && !['content', 'embed'].includes(this.keys[3])) return this.unknownKey()

        let msg = this.set.onNewLevel.message

        if(msg.content == null && msg.embeds.length == 0) return this.Error('Сообщение не указано')

        this.interaction.reply(formatObject(msg, (string) => {
            return format(string, {
                USERNAME: this.interaction.user.username,
                TAG: this.interaction.user.tag,
                MENTION: `<@!${this.interaction.user.id}>`,
                LEVEL: 999,
            })
        }))
    }

    ONLMessageContent() {
        if(!this.value) return this.curValEmbed(this.key, this.set?.onNewLevel.message.content || '*Не установлено*')

        if(format(this.value, { // один один один один один один
            USERNAME: '11111111111111111111111111111111',
            TAG: '11111111111111111111111111111111#1111',
            MENTION: '<@111111111111111111>',
            LEVEL: '111'
        }).length > 2000 ) return this.falseValue('Слишком большое поздравление')

        if(!this.set) {
            this.autosetVal('levels.enabled', 'true')
            this.autosetVal('levels.transfer', 'true')
            this.autosetVal('levels.onNewLevel.mode', 'msg')
            this.autosetVal('levels.onNewLevel.messageDeleteTimeout', '5')

            let newLVL = new LevelsServer({ guildID: this.guildID, onNewLevel: { message: { content: this.value } } })

            newLVL.save().catch(err => console.log(err))
        } else {
            if(!this.set.enabled) {
                this.set.enabled = true

                this.autosetVal('levels.enabled', 'true')
            }

            if(!this.set.onNewLevel.mode.includes('msg') && this.value !== '{{NONE}}') {
                this.set.onNewLevel.mode.push('msg')

                this.autosetVal('levels.onNewLevel.mode', this.set.onNewLevel.mode.includes('react') ? 'all' : 'msg')
            }

            if(this.set.onNewLevel.mode.includes('msg') && this.value == '{{NONE}}' && this.set.onNewLevel.message.embeds.length == 0) {
                this.set.onNewLevel.mode.splice(this.set.onNewLevel.mode.indexOf('msg'), 1)

                this.autosetVal('levels.onNewLevel.mode', this.set.onNewLevel.mode.includes('react') ? 'react' : 'null')
            }

            this.set.onNewLevel.message.content = (this.value == '{{NONE}}' ? null : this.value)
            this.set.save().catch(err => console.log(err))
        }

        this.Success(this.key, this.value)
        this.sendEmbeds()
    }

    async ONLMessageEmbed() {
        if(!this.value) return this.curValEmbed(this.key, this.set?.onNewLevel.message.embeds || '*Не установлено*')

        if(this.value == '{{NONE}}') {
            if(!this.set) {
                this.autosetVal('levels.enabled', 'true')
                this.autosetVal('levels.transfer', 'true')
                this.autosetVal('levels.onNewLevel.mode', 'msg')
                this.autosetVal('levels.onNewLevel.message.content', '**{{MENTION}}**, поздравляю с повышением до **{{LEVEL}}** уровня!')
                this.autosetVal('levels.onNewLevel.messageDeleteTimeout', '5')
    
                let newMSG = new LevelsServer({guildID: this.guildID})
                newMSG.save().catch(err => console.log(err))
            } else {
                if(!this.set.enabled) {
                    this.set.enabled = true

                    this.autosetVal('levels.enabled', 'true')
                }

                if(this.set.onNewLevel.message.content == null && this.set.onNewLevel.mode.includes('msg')) {
                    this.set.onNewLevel.mode.splice(this.set.onNewLevel.mode.indexOf('msg'), 1)

                    this.autosetVal('levels.onNewLevel.mode', this.set.onNewLevel.mode.includes('react') ? 'react' : 'null')
                }

                this.set.onNewLevel.message.embeds = []
                this.set.save().catch(err => console.log(err))
            }

            this.Success(this.key, this.value)
            this.sendEmbeds()

            return
        }

        let stringToParse = `{"obj":[${this.value.replace(/(```(\w+)?)/g, '').trim()}]}` //  Это то, что мы будем парсить. Выглядит сложно, но оно работает и я его не трогаю)

        let stringToParseAndSend = format(stringToParse, {
            USERNAME: '11111111111111111111111111111111',
            TAG: '11111111111111111111111111111111#1111',
            MENTION: '<@111111111111111111>',
            LEVEL: '111'
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
                this.autosetVal('levels.enabled', 'true')
                this.autosetVal('levels.transfer', 'true')
                this.autosetVal('levels.onNewLevel.mode', 'msg')
                this.autosetVal('levels.onNewLevel.messageDeleteTimeout', '5')
    
                let newLVL = new LevelsServer({
                    guildID: this.guildID,
                    onNewLevel: {
                        message: {
                            content: null,
                            embeds: Array.isArray(savingJson) ? savingJson : [savingJson],
                        }
                    }
                })
                newLVL.save().catch(err => console.log(err))
            } else {
                if(!this.set.enabled) {
                    this.set.enabled = true
    
                    this.autosetVal('levels.enabled', 'true')
                }
    
                this.set.onNewLevel.message.embeds = Array.isArray(savingJson) ? savingJson : [savingJson],
                this.set.save().catch(err => console.log(err))
            }
    
            this.Success(this.key, this.value)
            this.sendEmbeds()
        } catch (err) {
            return this.Error('Ошибка! Перепроверь свой embed!', `Подробно: \`${err}\``)
        }
    }

    async ONLReact() {
        if(!this.value) return this.curValEmbed(this.key, this.set?.onNewLevel.reaction || '*Не установлено*')

        let emoji      = discord.Util.parseEmoji(this.value)
        let testEmoji  = emoji.id ?? emoji.name
        let msg        = await this.interaction.channel.send({content: 'Тестовое сообщение'})
        let error      = false

        await msg.react(testEmoji).catch(() => {
            error = true
            msg.delete()
            return this.falseValue('Неизвестный эмодзи')
        })

        if(error) return

        msg.delete()

        if(!this.set) {
            this.autosetVal('levels.enabled', 'true')
            this.autosetVal('levels.transfer', 'true')
            this.autosetVal('levels.onNewLevel.mode', 'react')
            this.autosetVal('levels.onNewLevel.messageDeleteTimeout', '5')

            let newLVL = new LevelsServer({
                guildID: this.guildID,
                onNewLevel: {
                    reaction: testEmoji,
                    mode: ['react'],
                    message: {
                        content: null
                    }
                }
            })

            newLVL.save().catch(err => console.log(err))
        } else {
            if(!this.set.enabled) {
                this.set.enabled = true

                this.autosetVal('levels.enabled', 'true')
            }

            if(!this.set.onNewLevel.mode.includes('react')) {
                this.set.onNewLevel.mode.push('react')

                this.autosetVal('levels.onNewLevel.mode', this.set.onNewLevel.mode.includes('msg') ? 'all' : 'react')
            }

            this.set.onNewLevel.reaction = testEmoji
            this.set.save().catch(err => console.log(err))
        }

        this.Success(this.key, testEmoji)
        this.sendEmbeds()
    }
}