const discord       = require("discord.js")
const chalk         = require("chalk")
const { join }      = require("path")
const fs            = require("fs")
// eslint-disable-next-line no-unused-vars
const Command       = require("./commands.js");

/**
 * Класс клиента который наследует класс клиента из Discord.JS.
 * Реализует такие мелочи как загрузчик команд, загрузчик событий,
 * а так-же имеет из под капота обработчик команд который
 * в случае чего можно отключить.
 * @extends {discord.Client}
 * @type {Client}
*/
module.exports = class Client extends discord.Client {
    /**
     * 
     * @param {ClientOptions} options 
     * @param {*} advancedOptions
     */
     constructor(options = {}, {
        commandsDir = "cmd",
        listenersDir = "events",
    }) {
        super(options);

        /**
         * Массив хранящий в себе все команды.
         * Не изменять! Может привести к последствиям
         * поправимыми только откатом кода и перезагрузкой.
         * @type {Array.<Command>}
         */
        this.commands = []

        /**
         * Массив хранящий в себе все обработчики событий.
         * @type {Array.<Listener>}
         */
        this.listenersObjects = []

        /**
         * Путь к папке где расположены файлы с событиями.
         * @type {string}
         */
        this.listenersDir = join(__dirname, "..", listenersDir ? listenersDir : "events")

        /**
         * Путь к папке где расположены файлы с командами.
         * @type {string}
         */
        this.commandsDir = join(__dirname, "..", commandsDir ? commandsDir : "cmd")
    }

    /**
     * Загружает все события и команды в папках путь к которым
     * указан в настройках клиента (client options)
     */
    loadAll() {
        console.log(chalk.cyan("[Загрузчик Событий] Инициализирована загрузка событий..."))
        this.loadListeners()
        console.log(chalk.cyan("[Загрузчик Событий] Все события успешно загружены!"))

        console.log(chalk.cyan("[Загрузчик Команд] Инициализирована загрузка команд..."))
        this.loadCommands()
        console.log(chalk.cyan("[Загрузчик Команд] Все команды успешно загружены!"))
    }

    /**
     * Загружает все события находящиеся в папке путь к которой указан
     * в настройках клиента (client options) или переданные методу.
     * @param {string} path
     */
    loadListeners(path = this.listenersDir) {
        for (let file of fs.readdirSync(path, {withFileTypes: true})) {
            if (file.isFile() && file.name.endsWith(".js")) {
                try {
                    const listeners = require(`${path}/${file.name}`)
                    if (listeners instanceof Array)
                        for (const listener of listeners) {
                            this.on(listener.name, listener.run.bind(null, this))
                            this.listenersObjects.push(listener)
                        }
                    else {
                        this.on(listeners.name, listeners.run.bind(null, this))
                        this.listenersObjects.push(listeners)
                    }
                    console.log(chalk.green(`+ ${file.name}`))
                } catch (e) {
                    console.log(chalk.red(`Не удалось загрузить событие ${file.name}\nОшибка: ${e}`))
                }
            }
            if (file.isDirectory())
                this.loadListeners(`${path}/${file.name}`)
        }
    }
    /**
     * Загружает все команды находящиеся в папке в указанном пути
     * в настройках клиента (client options) и переданные методу.
     * @param {string} path
     */
    loadCommands(path = this.commandsDir) {
        for (let file of fs.readdirSync(path, {withFileTypes: true})) {
            if (file.isFile() && file.name.endsWith(".js")) {
                try {
                    const command = require(`${path}/${file.name}`)
                    this.commands.push(command);
                    console.log(chalk.green(`+ ${file.name}`))
                } catch (e) {
                    console.log(chalk.red(`Не удалось загрузить команду ${file.name}.\nОшибка: ${e}`))
                }
            }
            if (file.isDirectory())
                this.loadCommands(`${path}/${file.name}`)
        }
    }
}