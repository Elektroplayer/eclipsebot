import DefaultClassSettings from './BaseSettingsClass.js'
import DefaultRoles from '../../models/DefaultRoles.js'
import { MessageEmbed } from 'discord.js'

export default class DefaultRolesSettings extends DefaultClassSettings {
    async Init () {
        this.set = await DefaultRoles.findOne({guildID: this.guildID}).exec()
    }

    enabled() {
        if(!this.value) return this.curValEmbed(this.key, this.set?.enabled || 'false')

        this.value = this.value.toLowerCase()
        if(!['true', 'false'].includes(this.value)) return this.falseValue()

        if(!this.set) {
            let newDR =  new DefaultRoles({
                guildID: this.guildID,
                enabled: this.value == 'true',
            })

            newDR.save().catch(err => console.log(err))
        } else {
            this.set.enabled = this.value == 'true'
            this.set.save().catch(err => console.log(err))
        }
        
        this.Success(this.key, this.value)
        this.sendEmbeds()
    }

    roles () {
        if(!this.keys[2]) {
            if(!this.set?.roles || this.set?.roles.length == 0) return this.curValEmbed(this.key, '*Не установлено*' )

            let myPos  = this.interaction.guild.me.roles.highest.position
            let arr    = this.set.roles.slice().map(elm => this.interaction.guild.roles.cache.get(elm).position >= myPos ? `*${elm}*` : elm)

            return this.curValEmbed(this.key, arr.join(', ') || '*Не установлено*' )
        }
        
        if(!['add', 'remove'].includes(this.keys[2])) return this.falseValue()
        if(!this.interaction.guild.roles.cache.get(this.value)) return this.falseValue('Предоставленной роли не существует')

        if(!this.set) {
            if(this.keys[2] == 'remove') return this.Error('Этой роли нету в списке')
            
            this.autosetVal('defaultRoles.enabled', 'true')

            let newDR = new DefaultRoles({ guildID: this.guildID, roles: [this.value] })

            newDR.save().catch(err => console.log(err))
            this.Success(this.key, this.value, 'добавлено')
        } else {
            if(this.keys[2] == 'add') {
                if(this.set.roles.includes(this.value)) return this.Error('Эта роль уже есть в списке')
                
                if(!this.set.enabled) {
                    this.set.enabled = true
    
                    this.autosetVal('defaultRoles.enabled', 'true')
                }

                this.set.roles.push(this.value)

                let rolePos  = this.interaction.guild.roles.cache.get(this.value).position
                let myPos    = this.interaction.guild.me.roles.highest.position
        
                if(rolePos>=myPos) this.embeds.push(new MessageEmbed()
                .setColor(this.client.config.colors.warnOrange)
                .setTitle('Я не смогу выдавать эту роль, так как она находится выше меня или на равне со мной'))

                this.Success(this.key, this.value, 'добавлено')
            } else {
                if(!this.set.roles.includes(this.value)) return this.Error('Этой роли нету в списке')
                
                if(!this.set.enabled) {
                    this.set.enabled = true
    
                    this.autosetVal('defaultRoles.enabled', 'true')
                }

                this.set.roles.splice(this.set.roles.indexOf(this.value), 1)
                this.Success(this.key, this.value, 'убрано')
            }

            if(!this.interaction.guild.me.permissions.has('MANAGE_ROLES')) this.embeds.push(new MessageEmbed()
            .setColor(this.client.config.colors.warnOrange)
            .setTitle('У меня нет права на выдачу ролей'))

            this.set.save().catch(err => console.log(err))
        }

        this.sendEmbeds()
    }
}