import Listener from '../structures/Listener.js'
// eslint-disable-next-line no-unused-vars
import { MessageEmbed } from 'discord.js'
import { version } from '../../versions.js'

import DefaultRoles from '../models/DefaultRoles.js'
import LevelsServer from '../models/LevelsServer.js'
import LevelsMember from '../models/LevelsMember.js'
import PrivateVoices from '../models/PrivateVoices.js'
import Messages from '../models/Messages.js'


export default [
    class GuildsAddListener extends Listener {
        constructor (...args) {
            super(...args)
            this.event = 'guildCreate'
        }

        exec(guild) {

            if(!guild) return //  Ходит слух, что он активируется, когда бот запускается
    
            let bots        = guild.members.cache.filter(m => m.user.bot).size
            let all         = guild.members.cache.size
            let exceptions  = [] // Будет добавлено в будущих обновлениях
            
            let test = bots > 50 && (bots / all) > 0.5 // Если ботов больше 50 и их больше половины, то сервер приравнивается к спам-серверам
            
            if(test && !exceptions.includes(guild.id)) {
                guild.owner.send({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('На вашем сервере было обнаружено более чем 50 ботов и их больше чем людей, поэтому он был помечен как спам-сервер!')
                        .setDescription('Если это ошибка, обратитесь в [поддержку](https://discord.gg/PHuvYMrvdr)!')
                    ]
                }).catch(() => {})
    
                this.client.channels.cache.get(this.client.config.main.channel).send({
                    embeds: [
                        new MessageEmbed().setTitle('Попытка входа на спам-сервер!')
                        .setColor(this.client.config.colors.warnOrange)
                        .addField('Имя:', guild.name)
                        .addField('ID:', guild.id)
                        .addField('Количество людей / из них ботов:', `${all} / ${bots}`)
                    ]
                })
    
                guild.leave()
                return
            }
    
            guild.channels.cache
            .filter(m => m.type == 'text' && m.permissionsFor(this.client.user).has('SEND_MESSAGES')).first()
            .send({
                embeds: [
                    new MessageEmbed()
                    .setColor(this.client.config.colors.default)
                    .setFooter({
                        text: 'И ещё раз спасибо) © Night Devs', 
                        iconURL: this.client.guilds.cache.get(this.client.config.main.guild).iconURL({ dynamic: true, size: 256 })
                    })
                    .setTitle('Спасибо, что добавили Eclipse на сервер!')
                    .setDescription('Бот поддерживает только русский язык!')
                    .addField('Информация:',`Команда справки: \`/help\`\nВерсия бота: \`${PACKAGE.version}\`\nСвяжитесь с [поддержкой](https://discord.gg/PHuvYMrvdr) при появлении проблем или пожеланий.`)
                    .addField('Полезные ссылки:','[Сервер поддержки](https://discord.gg/PHuvYMrvdr) | [GitHub бота](https://github.com/Night-Devs/EclipseBot) | Ссылка на бота в профиле бота')
                ]
            })
    
            this.client.channels.cache.get(this.client.config.main.channel).send(
                new MessageEmbed()
                .setTitle('Новый сервер!')
                .setColor(this.client.config.colors.successGreen)
                .addField('Имя:', guild.name)
                .addField('ID:', guild.id)
                .addField('Количество людей / из них ботов:', `${all} / ${bots}`)
            )
    
        }
    },

    class GuildsDeleteListener extends Listener {
        constructor (...args) {
            super(...args)
            this.event = 'guildDelete'
        }

        exec(guild) {

            //  Сносим все настройки

            let guildID = guild.id
    
            Messages.deleteMany({ guildID }, (err) => { if(err) console.log(err) })
            LevelsServer.deleteOne({ guildID }, (err) => { if(err) console.log(err) })
            LevelsMember.deleteMany({ guildID }, (err) => { if(err) console.log(err) })
            DefaultRoles.deleteOne({ guildID }, (err) => { if(err) console.log(err) })
            PrivateVoices.deleteMany({ guildID }, (err) => { if(err) console.log(err) })
    
            //  Оповещаем
            this.client.channels.cache.get(this.client.config.main.channel).send(
                new MessageEmbed().setTitle('Удалён сервер!').setColor(this.client.config.colors.errorRed)
                .addField('Имя:', guild.name)
                .addField('ID:', guild.id)
                .addField('Количество людей:', guild.members.cache.size)
            )
        }
    }
]