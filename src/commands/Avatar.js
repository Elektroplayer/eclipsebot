// eslint-disable-next-line no-unused-vars
import { MessageEmbed, CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'

export default class AvatarCommand extends Command {
    info = {
        description: 'Показать аватар',
        name: 'avatar',
        options: [
            {
                name: 'user',
                description: 'Если хочешь узнать аватар другого человека',
                type: 'USER',
                required: false,
            }
        ]
    }

    help = {
        category: 'Общее',
        arguments: [
            '**<без аргументов>** - Покажет аватар автора.',
            '`user` - Покажет аватар указанного пользователя.'
        ],
        using: [
            '**/avatar** - Покажет аватар автора.',
            '**/avatar** `user: @GoodUser#1234` - Покажет аватар пользователя.'
        ]
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        let user = interaction.options._hoistedOptions[0]?.user ?? interaction.user

        let options = { dynamic: true, size: 4096 }

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor(this.client.config.colors.default)
                .setTitle('Аватар:')
                .setDescription(`[Если не загрузилось.](${user.avatarURL(options) || user.defaultAvatarURL})`)
                .setImage(user.avatarURL(options) || user.defaultAvatarURL)
                .setFooter({text: this.client.footerMaker(interaction)})
            ]
        })
    }
}

