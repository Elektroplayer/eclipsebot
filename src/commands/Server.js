// eslint-disable-next-line no-unused-vars
import { CommandInteraction, MessageEmbed } from 'discord.js'
import Command from '../structures/Command.js'
import strftime from 'strftime'
import {ru_RUmod} from '../structures/Utils.js'

export default class ServerCommand extends Command {
    info = {
        description: 'Информация о сервере',
        name: 'server'
    }

    help = {
        category: 'Общее',
        arguments: [
            '**<без аргументов>** - Показать информацию о сервере.'
        ],
        using: [],
    }

    /**
     * @param {CommandInteraction} interaction
    */
    async exec(interaction) {
        await interaction.reply({embeds: [
            new MessageEmbed()
            .setColor(this.client.config.colors.default)
            .setTitle(`Информация о сервере "${interaction.guild.name}"`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
            .addField('Создан:', `\`${strftime.localize(ru_RUmod)('%d %B %Y г., %H:%M', new Date(interaction.guild.createdTimestamp))}\``, true)
            .addField('Создатель:', `${interaction.guild.members.cache.get(interaction.guild.ownerId).user}`, true)
            .addField('\u200b','\u200b',true)
            .addField('Участники:', 
                `Всего: \`${interaction.guild.members.cache.size}\`\n` +
                `Из них людей: \`${interaction.guild.members.cache.filter(member => !member.user.bot).size}\`\n`+
                `Онлайн: \`${interaction.guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status !== 'offline').size}\`\n` +
                `Боты: \`${interaction.guild.members.cache.filter(member => member.user.bot).size}\``, true
            )
            .addField('Ролей:', `\`${interaction.guild.roles.cache.size}\``, true)
            .addField('ID:', `\`${interaction.guild.id}\``)
            .setFooter({text: this.client.footerMaker(interaction)})
        ]})
    }
}
