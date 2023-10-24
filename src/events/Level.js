import Listener from '../structures/Listener.js'
import { dynamicTimer, getLevel } from '../structures/Utils.js'
import LevelsMember from '../models/LevelsMember.js'
import LevelsServer from '../models/LevelsServer.js'
// eslint-disable-next-line no-unused-vars
import { Message } from 'discord.js'
import { format } from '../structures/Utils.js'

var timers = {}

function testExceptions (set, message) {
    return !set.exceptions.channels.includes(message.channel.id) &&              // Тестирование на канал
    set.exceptions.roles.every(e => !message.member.roles.cache.has(e))          // Тестирование на присутствие непозволительных ролей
}

export default [
    class LevelAddListener extends Listener {
        event = 'messageCreate'

        /**
         * @param {Message} message 
         * @returns 
         */
        async exec(message) {
            if (message.author.bot || message.channel.type == 'dm') return

            let content  = message.content
            let xpAdd    = content.length/2 <= 150 ? Math.floor(content.length/2) : 150
            let guild    = message.guild.id
            let member   = message.author.id
            let delay

            let serverSettings = await LevelsServer.findOne({guildID: guild}).exec()

            if(!serverSettings || !serverSettings.enabled) return
            if(!testExceptions(serverSettings, message)) return
            
            LevelsMember.findOne({guildID: guild, memberID: member}, (err,set) => {
                if(err) console.log(err)

                if(timers[message.author.id]) {
                    delay = timers[message.author.id].getTime()
                    timers[message.author.id].addTime(3000)
                } else {
                    delay = 0

                    //let client = this.client // Потому что this использовать внутри таймера нельзя
                    timers[message.author.id] = new dynamicTimer(function() {
                        delete timers[message.author.id]
                    }, 4000)
                }

                // console.log(`${delay}, ${xpAdd}, ${Math.floor(xpAdd * (5000 - delay)/5000) + 1}`)
                xpAdd = Math.floor(xpAdd * (6000 - delay)/6000) + 1
                xpAdd = xpAdd <= 0 ? 1 : xpAdd

                if(!set) {
                    let newXP =  new LevelsMember({
                        guildID: guild,
                        memberID: member,
                        xp: xpAdd
                    })

                    newXP.save().catch(err => console.log(err))
                } else {
                    // Эта часть вызывает немного сомнений
                    if(getLevel(set.xp) !== getLevel(set.xp+xpAdd)) {
                        if(
                            serverSettings.onNewLevel.mode.includes('react') &&
                            serverSettings.onNewLevel.reaction
                        ) try {
                            message.react(serverSettings.onNewLevel.reaction)
                        // eslint-disable-next-line no-empty
                        } catch (err) {}

                        if(
                            serverSettings.onNewLevel.mode.includes('msg') 
                            && (
                                serverSettings.onNewLevel.message.content !== null ||
                                serverSettings.onNewLevel.message.embeds.length > 0
                            )
                        ) try {
                            message.reply(format(serverSettings.onNewLevel.message, {
                                USERNAME: member.user.username,
                                TAG: member.user.tag,
                                MENTION: `<@!${member.id}>`,
                                LEVEL: getLevel(set.xp+xpAdd),
                            })).then(msg => {
                                if (serverSettings.onNewLevel.deleteTimeout>0) setTimeout(() => msg.delete(), serverSettings.onNewLevel.deleteTimeout)
                            })
                        // eslint-disable-next-line no-empty
                        } catch (err) {}
                    }

                    set.xp += xpAdd
                    set.save().catch(err => console.log(err))
                }
            })
        }
    },

    class LevelRemoveListener extends Listener {
        event = 'messageDelete'

        async exec(message) {
            if(!message || !message.content || !message.author) return // И такие сообщения попадаются

            if (message.author?.bot || message.channel.type == 'dm') return

            let content   = message.content
            let xpRemove  = content.length/2 <= 150 ? Math.floor(content.length/2) : 150
            let guild     = message.guild.id
            let member    = message.author.id

            let serverSettings = await LevelsServer.findOne({guildID: guild}).exec()

            if(!serverSettings) return
            if(!testExceptions(serverSettings, message)) return

            LevelsMember.findOne({guildID: guild, memberID: member}, (err,set) => {
                if(err) console.log(err)

                if(!set) {
                    let newXP =  new LevelsMember({
                        guildID: guild,
                        memberID: member,
                        xp: 0
                    })

                    newXP.save().catch(err => console.log(err))
                } else {
                    set.xp -= xpRemove + 1 // Отрицательные значения - не баг, а фича
                    set.save().catch(err => console.log(err))
                }
            })
        }
    },

    class LevelUpdateListener extends Listener {
        event = 'messageUpdate'

        async exec(oldMessage, newMessage) {

            // Это выглядит весьма странно, но иначе некоторая информация мне будет недоступна в лучшем случае...
            if (!oldMessage || !newMessage) return
            oldMessage = oldMessage.content ? oldMessage : await oldMessage.channel.messages.fetch(oldMessage.id)

            if (newMessage.author?.bot || newMessage.channel.type == 'dm') return

            let oldContent  = oldMessage.content
            let newContent  = newMessage.content

            if (oldContent.length == newContent.length) return // Даже не будем париться

            let xpAdded     = (oldContent.length/2 <= 150 ? Math.floor(oldContent.length/2) : 150) + 1
            let xpAdd       = (newContent.length/2 <= 150 ? Math.floor(newContent.length/2) : 150) + 1 - xpAdded

            //console.log(xpAdd)
            xpAdd = xpAdd <= 0 ? xpAdd : Math.floor(xpAdd * 0.5) // Если меньше нуля - оставляем минус так как есть. Если больше, то плюс уменьшаем в половину
            //console.log(xpAdd)

            let guild   = newMessage.guild.id
            let member  = newMessage.author.id

            let serverSettings = await LevelsServer.findOne({guildID: guild}).exec()

            if(!serverSettings) return
            if(!testExceptions(serverSettings, newMessage)) return

            LevelsMember.findOne({guildID: guild, memberID: member}, (err,set) => {
                if(err) console.log(err)

                if(!set) {
                    let newXP =  new LevelsMember({
                        guildID: guild,
                        memberID: member,
                        xp: 0
                    })

                    newXP.save().catch(err => console.log(err))
                } else {
                    set.xp += xpAdd // Отрицательные значения - не баг, а фича
                    set.save().catch(err => console.log(err))
                }
            })
        }
    }
]

//  Нашёл чёрную дыру опыта:
//  Отправляем сообщение на 10 символов
//  Изменяем его добавив ещё 2 символа сзади
//  Повторяем предыдущий шаг, пока не надоест или не дойдём до 2000
//  Удаляем сообщение
//  Тадам! Мы потеряли опыт. Он исчез, ушёл в чёрную дыру.

//  Чёрные дыры опыта - не самое страшное. При таких обстоятельствах в день человек может потерять ну 1 - 2 опыта.
//  Самая главная проблема в белых дырах, когда при определённых махинациях опыта наоборот становится больше.

//  Теоретически, если писать сообщение "1", а потом его сразу менять на сообщение с 300-ми единиц,
//  то мы будем получать примерно по 75 опыта с каждого сообщения избегая куладун.
//  Однако так, скорее всего будут делать только селф-боты, а это уже нарушение TOS.

//  Самый лучший способ избавления от дыр вообще - конспектировать опыт за каждое сообщение или убрать таймеры
//  Первый способ будет требовать со временем огромное количество памяти. Убирая таймеры мы разрешаем спам.
