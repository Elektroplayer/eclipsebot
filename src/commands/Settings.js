/* eslint-disable no-case-declarations */
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from 'discord.js'

import Command from '../structures/Command.js'
import Errors from '../structures/Errors.js'

import WelcomeSettings from './SettingsFolder/WelcomeSettings.js'
import DirectSettings from './SettingsFolder/DirectSettings.js'
import GoodbyeSettings from './SettingsFolder/GoodbyeSettings.js'
import PrivateVoicesSettings from './SettingsFolder/PrivateVoicesSettings.js'
import DefaultRolesSettings from './SettingsFolder/DefaultRoles.js'
import LevelsSettings from './SettingsFolder/LevelsSettings.js'

export default class RollCommand extends Command {
    info = {
        description: 'Настройки',
        name: 'settings',
        options: [
            {
                name: 'key',
                description: 'Ключ',
                type: 'STRING',
                required: true
            },
            {
                name: 'value',
                description: 'Значение',
                type: 'STRING',
                required: false,
            }
        ]
    }

    help = {
        category: 'Общее',
        arguments: [
            '`key` - Посмотреть значение ключа',
            '`key` `value` - Установить значение ключу'
        ],
        using: [
            '**/settings** `key: welcome.enabled` `value: true` - Установит ключу значение',
            '**/settings** `key: welcome.enabled` - Посмотрит значение ключа',
            'Все возможные ключи и их возможные значения находятся [тут](https://github.com/Night-Devs/EclipseBot/blob/main/instructios.md)',
        ],
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        if(!interaction.member.permissions.has('ADMINISTRATOR')) return Errors.falsePerms(interaction, 'Администратор')

        let key  = interaction.options._hoistedOptions.find(x=>x.name=='key').value
        let keys = key.toLowerCase().split('.')

        let settingsFiles = {
            'welcome': WelcomeSettings,
            'goodbye': GoodbyeSettings,
            'direct': DirectSettings,
            'defaultroles': DefaultRolesSettings,
            'privatevoices': PrivateVoicesSettings,
            'levels': LevelsSettings
        }

        if(settingsFiles[keys[0]]) {
            let settings = new settingsFiles[keys[0]](interaction, this.client)

            if(settings[keys[1]]) {
                await settings.Init()
                return settings[keys[1]]()
            }
        }

        Errors.custom(interaction, 'Неизвестный ключ')
    }
}
