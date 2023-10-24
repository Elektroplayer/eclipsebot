import { CommandTypes } from '../structures/Enums.js'
// eslint-disable-next-line no-unused-vars
import { ContextMenuInteraction, MessageEmbed } from 'discord.js'
import Command from '../structures/Command.js'

export default class SwapCommand extends Command {
    info = {
        name: 'Показать аватар',
        type: CommandTypes.User
    }

    help = {
        category: 'Приложения',
        description: 'Покажет аватар выбранного человека',
        arguments: [],
        using: [
            '`Member -> Показать аватар` - Покажет аватар выбранного человека.',
        ]
    }

    /**
     * @param {ContextMenuInteraction} interaction
     * @returns {Promise<void>}
     */
    async exec(interaction) {
        let user = interaction.options._hoistedOptions[0]?.user
        let options = { dynamic: true, size: 4096 }

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor(this.client.config.colors.default)
                .setTitle('Аватар:')
                .setDescription(`[Если не загрузилось](${user.avatarURL(options) || user.defaultAvatarURL})`)
                .setImage(user.avatarURL(options) || user.defaultAvatarURL)
                .setFooter({text: this.client.footerMaker(interaction)})
            ],
            ephemeral: true
        })
    }
}
