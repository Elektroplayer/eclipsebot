/*

               -- ВНИМАНИЕ! --

      Данный код был написан для теста!
    ЕГО НЕЛЬЗЯ ИСПОЛЬЗОВАТЬ БЕЗ ИЗМЕНЕНИЙ!
 Функция работает, но требует настроек и модель!

           -- ВЫ ПРЕДУПРЕЖДЕНЫ! --
 
*/

import Listener from '../structures/Listener.js'
import chalk from 'chalk'

const settings = {
    'messageID': '911527669131259945',
    'entry': [{
        'emoji': '⌚',
        'role': '897504759278358529'
    },{
        'emoji': '🌼',
        'role': '906949200850354196'
    },{
        'emoji': '🖕',
        'role': '891238283550527508'
    },{
        'emoji': '🩸',
        'role': '889799344184762378'
    },{
        'emoji': '🍃',
        'role': '889796522080882688'
    }]
}


export default [
    class ReactAddListener extends Listener {
        constructor (...args) {
            super(...args)
            this.event = 'messageReactionAdd'
        }

        async exec(reaction, user) {
            //  Когда настанет время и придут два всадника здравого смысла, эта строка раскоментируется
            //const settings = await RoleReaction.findOne({messageID: reaction.message.id, guildID: reaction.message.guild.id}).exec()

            // Если еакцию поставил бот или вообще вне сервера
            if ( user.bot || !reaction.message.guild) return
    
            let guild      = reaction.message.guild
            let roles      = guild.roles.cache
            let member     = guild.members.cache.get(user.id)
            let emoji_name = reaction.emoji.name
            let emoji_id   = reaction.emoji.id
    
            if(!settings.entry.find(elm => elm.emoji == emoji_name || elm.emoji == emoji_id)) return
    
            let role = roles.get(settings.entry.find(elm => elm.emoji == emoji_name || elm.emoji == emoji_id).role) // roles.get(settings.roles[emoji_name] || settings.roles[emoji_id])
            if (!role) return
    
            await member.roles.add(role).catch(async e => {
                if (e.code === 50013) return
                else {
                    console.log(chalk.red('[ERR] [RoleReaction] ') + 'Неизвестная ошибка!')
                    console.log(e)
                }
            })
        }
    },

    class ReactRemoveListener extends Listener {
        constructor (...args) {
            super(...args)
            this.event = 'messageReactionRemove'
        }

        async exec(reaction, user) {
            // Если реакцию поставил бот или вне сервера
            if (user.bot || !reaction.message.guild) return
    
            let guild         = reaction.message.guild
            let roles         = guild.roles.cache
            let member        = guild.members.cache.get(user.id)
            let emoji_name    = reaction.emoji.name
            let emoji_id      = reaction.emoji.id
    
            if(!settings.entry.find(elm => elm.emoji == emoji_name || elm.emoji == emoji_id)) return
            
            let role = roles.get(settings.entry.find(elm => elm.emoji == emoji_name || elm.emoji == emoji_id).role)
            if (!role) return
    
            await member.roles.remove(role).catch(async e => {
                if (e.code === 50013) return
                else {
                    console.log(chalk.red('[ERR] [RoleReaction] ') + 'Неизвестная ошибка!')
                    console.log(e)
                }
            })
        }
    }
]
