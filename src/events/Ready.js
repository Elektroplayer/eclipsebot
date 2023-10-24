import Listener from '../structures/Listener.js'
import chalk from 'chalk'

function activities (bot) {
    return [
        {name: 'Аниме', options: {type: 'WATCHING'}},
        {name: '/help - Помощь', options: {type: 'PLAYING'}},
        {name: `${bot.guilds.cache.size} серверов`, options: {type: 'PLAYING'}},
        {name: `${bot.users.cache.size} пользователей`, options: {type: 'PLAYING'}},
    ]
}

export default class ReadyListener extends Listener {
    event = 'ready'

    async exec() {
        console.log(chalk.magenta(` Залогинен под ${this.client.user.tag} (${this.client.user.id})!`))
        
        await this.client.loadCommands()

        let arrActivities
        let i = 0
        setInterval(
            () => {
                arrActivities = activities(this.client)
                this.client.user.setActivity(arrActivities[i % arrActivities.length].name, arrActivities[i % arrActivities.length].options)
                i++
            }, 5000
        )
    }
}
