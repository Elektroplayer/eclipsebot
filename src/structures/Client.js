// eslint-disable-next-line no-unused-vars
import { Client as DClient, CommandInteraction } from 'discord.js'
// eslint-disable-next-line no-unused-vars
import Command from './Command.js'
// eslint-disable-next-line no-unused-vars
import Listener from './Listener.js'
import { readdirSync } from 'fs'
import chalk from 'chalk'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import config from '../../config.js'

const { cyan, green } = chalk
const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Класс клиента который наследует класс клиента из Discord.JS.
 * Реализует такие мелочи как загрузчик команд, загрузчик событий.
*/
export default class Client extends DClient {

    /**
     * Объект с настройками
     */
    config = config
    
    /**
     * Массив хранящий в себе все команды.
     * Не изменять! Может привести к последствиям
     * поправимыми только откатом кода и перезагрузкой.
     * @type {Command[]}
     */
    commands = []

    /**
     * Массив хранящий в себе все обработчики событий.
     * @type {Listener[]}
     */
    newListeners = []

    /**
     * Создание футера
     * @param {CommandInteraction} interaction
     * @param {string | undefined} forcedFooter
     * @returns {string}
     */
    footerMaker (interaction, forcedFooter) {
        if(forcedFooter) return '© Night Devs | ' + forcedFooter // Если у нас указан футер, то устанавливаем его принудительно

        let countOfCases  = Math.floor( Math.random() * 36500 ) + 1 // Всего возможных случаев
        let superFooters  = [ // Супер, потому что круто!
            'Затмение наступило! Срочно пиши в тех. поддержку!',
            'Иди своей дорогой, сталкер',
            'Вы не могли бы подписать мою петицию?',
            'Я уже говорил тебе, что такое безумие, а?',
            'Шевелись, Плотва!'
        ]
        let randomNum    = Math.floor( Math.random() * superFooters.length ) // Выбираем рандомный футер
        let footer       = countOfCases > 224 ? 'Когда наступит затмение...' : superFooters[ randomNum ] // По дефолту футер ожидает затмения, но если правильно выпадут кости, футер будет особенным

        if(randomNum === 0 && countOfCases <= 224) console.log('Это произошло! ' + interaction.user.tag + ' ' + interaction.id) // Защита от очень умных

        return '© Night Devs | ' + footer
    }

    /**
     * Загружает все команды находящиеся в папке commands
     * @param {string} path
     * @returns {Promise<void>}
     */
    async loadCommands(path = 'commands') {
        console.log(cyan('\n COMMANDS: '))

        let commandsPath = join(__dirname, '..', path)
        for (let dirent of readdirSync(commandsPath, {withFileTypes: true})) {
            if (dirent.isDirectory()) {
                if(dirent.name !== 'SettingsFolder') await this.loadCommands(`${path}/${dirent.name}`)
                continue
            }
            if (!dirent.name.endsWith('.js')) continue

            let commandClass = (await import(pathToFileURL(commandsPath + '/' +dirent.name).pathname)).default

            /**
             * @type {Command}
             */
            let command = new commandClass(this)
            this.commands.push(command)

            if(command.enabled) {
                console.log(chalk.green('- ' + command.info.name))
                command.init()
            } else console.log(chalk.red(command.info.name+ ' ignored'))
            
            //  else command.disable(); // Нужно будет реализовать удаление команды если что
        }

        console.log('')
    }

    /**
     * Загружает все события находящиеся в папке events
     * @param {string} path
     * @param {string} prevPath
     * @returns {Promise<void>}
     */
    async loadListeners(path = 'events', prevPath = '') {
        if (!prevPath) console.log(cyan(' EVENTS: '))

        let listenersPath = join(__dirname, '..', path)
        for (const dirent of readdirSync(listenersPath, { withFileTypes: true })) {
            if (dirent.isDirectory()) {
                this.loadListeners(`${path}/${dirent.name}`, `${prevPath}/${dirent.name}`)
                continue
            }
            if (!dirent.name.endsWith('.js') && !dirent.name.endsWith('.ts')) continue

            console.log(cyan(`${prevPath}/${dirent.name}`))

            let listenersClasses = (await import(pathToFileURL(listenersPath+ '/' + dirent.name).pathname)).default

            if (listenersClasses instanceof Array) {
                for (const [index, listenerClass] of listenersClasses.entries()) {
                    const listener = new listenerClass(this)
                    this.newListeners.push(listener)
                    this.on(listener.event, listener.exec.bind(listener))
                    console.log(green(` ${index + 1 < listenersClasses.length ? '├' : '└'}─ ${listener.constructor.name}`))
                }
            } else {
                const listener = new listenersClasses(this)
                this.newListeners.push(listener)
                this.on(listener.event, listener.exec.bind(listener))
            }
        }
        console.log('')
    }
}
