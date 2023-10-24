import { CommandTypes } from './Enums.js'
// eslint-disable-next-line no-unused-vars
import Client from './Client.js'

export default class Command {
    /**
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client

        this.exec = this.exec.bind(this)
    }

    info = {
        name: 'undefined',
        description: 'Разработчик идиот и забыл сделать описание команде',
        type: CommandTypes.Chat
    }

    enabled = true

    help = {
        category: '',
        arguments: [],
        using: []
    }

    /**
     * @type {string[]}
     */
    permissions = []

    async init () {
        if (!this.enabled) return

        await this.client.application?.fetch()

        if (this.client.config.mode == 'debug') await this.client.application?.commands?.create(this.info, this.client.config.main.guild)
        else await this.client.application?.commands?.create(this.info)
    }

    async exec() {
        console.log(`Привет идиот, ты тут забыл написать 'exec' у ${this.constructor.name}, пжлст, не нервируй меня и исправь это.`)
        setTimeout(() => {
            console.log('Тогда придётся с тобой по плохому.')
            process.exit(0)
        }, 60e3)
    }
}
