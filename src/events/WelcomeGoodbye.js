import Listener from '../structures/Listener.js'
import DefaultRoles from '../models/DefaultRoles.js'
import Messages from '../models/Messages.js'
// import ERRORS from '../structures/Errors.js'
import { format } from '../structures/Utils.js'

// Функция форматирует строки в многоуровневом объекте по заданной функции
function formatObject(object, format) {
    if (typeof object == 'string') return format(object)

    else if (Array.isArray(object)) return object.map(elm => {
        return formatObject(elm, format)
    })

    else if (typeof object == 'object') {
        for(let key in object) object[key] = formatObject(object[key], format)

        return object
    }

    else {
        return object
    }
}

function executable (member, err, set) {
    if(err) console.log(err)

    if(!set || !set?.channelID || !set?.message || !set?.enabled) return

    let channel = member.guild.channels.cache.get(set.channelID)

    // На самом деле это не канал, но тк я в совершенстве знаю свою же "библиотеку", я могу позволить себе использовать такие костыли
    // let errChannel = {channel: member.guild.owner} // Пока что не требуется

    if(!channel) return // ERRORS.custom(errChannel, `Ошибка при поиске канала \`${set.channelID}\``)
    if(!(
        channel.permissionsFor(this.client.user).has('SEND_MESSAGES') &&
        channel.permissionsFor(this.client.user).has('VIEW_CHANNEL')
    )) return // ERRORS.custom(errChannel, `Нету права для отправки сообщения в канал \`${set.channelID}\``)
    if(set.message.embeds.length > 0 && !channel.permissionsFor(this.client.user).has('EMBED_LINKS')) return // ERRORS.custom(errChannel, `Нету права для отправки embed-сообщения в канал \`${set.channelID}\``)

    if(set.message.content && set.message.embeds.length > 0) return 

    channel.send( formatObject(set.message, (string) => {
        return format(string, {
            USERNAME: member.user.username,
            TAG: member.user.tag,
            MENTION: `<@!${member.id}>`,
            GUILDNAME: member.guild.name,
            COUNT: member.guild.members.cache.size
        })
    }))
}

export default [
    class WelcomeListener extends Listener {
        event = 'guildMemberAdd'

        async exec(member) {
            Messages.findOne({type: 'Welcome', guildID: member.guild.id}, executable.bind(this, member))

            Messages.findOne({type: 'Direct', guildID: member.guild.id}, (err,set) => {
                if(err) console.log(err)

                if(!set || !set?.message) return

                member.send( formatObject(set.message, (string) => {
                    return format(string, {
                        USERNAME: member.user.username,
                        TAG: member.user.tag,
                        MENTION: `<@!${member.id}>`,
                        GUILDNAME: member.guild.name,
                        COUNT: member.guild.members.cache.size
                    })
                // eslint-disable-next-line no-unused-vars
                })).catch(e => {})
            })

            DefaultRoles.findOne({guildID: member.guild.id}, (err,set) =>{
                if(err) console.log(err)

                if(!set || !set?.roles[0]) return

                if (!member.guild.me.permissions.has('MANAGE_ROLES')) return

                set.roles.forEach(elm => {
                    if(!member.guild.roles.cache.get(elm)) {
                        set.roles.splice(set.roles.indexOf(elm), 1)
                        set.save().catch(err => console.log(err))
                    } else member.roles.add(elm).catch(() => {}
                        // ERRORS.custom({channel: member.guild.owner}, `Ошибка при добавлении роли \`${elm}\``)
                    )
                })
            })
        }
    },

    class GoodbyeListener extends Listener {
        event = 'guildMemberRemove'

        async exec(member) {
            Messages.findOne({type: 'Goodbye', guildID: member.guild.id}, executable.bind(this,member))
        }
    }
]

