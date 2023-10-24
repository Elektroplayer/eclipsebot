import Listener from '../structures/Listener.js'
// eslint-disable-next-line no-unused-vars
import { CommandInteraction, MessageEmbed } from 'discord.js'

export default [
    class interactionCommandsListener extends Listener {
        constructor (...args) {
            super(...args)
            this.event = 'interactionCreate'
        }

        /**
         * @param {CommandInteraction} interaction 
         * @returns 
         */
        async exec(interaction) {
            if (!interaction.isApplicationCommand()) return

            const command = this.client.commands.find(v => v.info.name === interaction.commandName)

            if (!command) return interaction.reply({content: 'Эта команда не работает. Можешь написать об этом в поддержку!', ephemeral: true})
            if(!(
                interaction.channel.permissionsFor(this.client.user).has('SEND_MESSAGES') &&
                interaction.channel.permissionsFor(this.client.user).has('VIEW_CHANNEL') &&
                interaction.channel.permissionsFor(this.client.user).has('EMBED_LINKS')
            )) interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(this.client.config.colors.errorRed)
                    .setTitle('Чел... есть права, которые мне жизненно необходимы...')
                    .setDescription('Дай мне права читать и писать сообщения, а так же вставлять ссылки')
                ]
            })

            try {
                await command.exec(interaction)
            } catch (e) {
                console.log(`You're an idiot.\nError: ${e}\n${e.stack}`)
                return interaction.reply({content: 'Эта команда не работает. Можешь написать об этом в поддержку!', ephemeral: true})
            }
        }
    },
    // Может быть в будущем
    // class textCommandsListener extends Listener {
    //     constructor (...args) {
    //         super(...args)
    //         this.event = 'messageCreate'
    //     }

    //     /**
    //      * 
    //      * @param {Message} message 
    //      * @returns 
    //      */
    //     async exec(message) {
    //         if(message.author.bot) return
    //     }
    // }
]
