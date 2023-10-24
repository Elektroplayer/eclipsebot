// eslint-disable-next-line no-unused-vars
import { MessageEmbed, CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import ERRORS from '../structures/Errors.js'

export default class ServerIconCommand extends Command {
    info = {
        description: 'Показать значок сервера',
        name: 'servericon',
    }

    help = {
        category: 'Общее',
        arguments: [
            '**<без аргументов>** - Покажет значок сервера.'
        ],
        using: []
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        if(!interaction.guild.iconURL({ dynamic: true, size: 512 })) return ERRORS.custom(interaction,'Сервер не имеет иконки!')
        let options = { dynamic: true, size: 4096 }

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor(this.client.config.colors.default)
                .setTitle('Значок сервера')
                .setDescription(`[Если не загрузилось.](${interaction.guild.iconURL(options)})`)
                .setImage(interaction.guild.iconURL(options))
                .setFooter({text: this.client.footerMaker(interaction)})
            ]
        })
    }
}

