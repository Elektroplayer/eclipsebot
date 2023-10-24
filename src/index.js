import { Intents } from 'discord.js'
import Client from './structures/Client.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

if (!process.env.MONGOTOKEN || !process.env.TOKEN) {
    console.log('Эй, дружок, ты забыл пару ЭКСТРЕМАЛЬНО важных параметров.\n' +
                'Убедись что ты создал .env конфиг и не допустил опечатки.')
    process.exit()
}

const bot = new Client({
    intents: Object.values(Intents.FLAGS),
    allowedMentions: {
        parse: ['users']
    },
    partials: ['MESSAGE', 'REACTION']
})

await bot.loadListeners()
bot.login(process.env.TOKEN)

mongoose.connect(process.env.MONGOTOKEN) //  Логиним mongoose
