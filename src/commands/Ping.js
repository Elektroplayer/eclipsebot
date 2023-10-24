// eslint-disable-next-line no-unused-vars
import { MessageEmbed, CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'

export default class PingCommand extends Command {
    info = {
        description: 'Проверка связи',
        name: 'ping'
    }

    help = {
        category: 'Прочее',
        arguments: [
            '**<без аргументов>** - Показать скорость соединения от хоста до серверов Discord.'
        ],
        using: []
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Понг!')
                .setColor(this.client.config.colors.default)
                .setDescription(`\`\`\`\n${interaction.client.ws.ping}ms\n\`\`\``)
            ],
        })
    }
}

