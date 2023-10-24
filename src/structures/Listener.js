// eslint-disable-next-line no-unused-vars
import Client from './Client.js'

export default class Listener {
    event = 'ready'

    /**
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client

        this.exec = this.exec.bind(this)
    }

    async exec() {
        console.log(`Привет идиот, ты тут забыл написать 'exec' у ${this.constructor.name}, пжлст, не нервируй меня и исправь это.`)
        setTimeout(() => {
            console.log('Тогда придётся с тобой по плохому.')
            process.exit(0)
        }, 60e3)
    }
}
