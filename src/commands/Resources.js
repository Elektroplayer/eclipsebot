import discord from 'discord.js'
import Command from '../structures/Command.js'
import { parseMS } from '../structures/Utils.js'
import { version } from '../../versions.js'

export default class ResCommand extends Command {
    info = {
        description: 'Используемые ресурсы',
        name: 'resources'
    }

    help = {
        category: 'NON',
        arguments: ['NON'],
        using: ['NON']
    }

    async init () {
        await this.client.application?.fetch()
        await this.client.application?.commands?.create(this.info, this.client.config.main.guild) // Не для простых смертных)
        //if (process.env.ECLIPSE_DEBUG == 'true') await this.client.application?.commands?.create(this.info, this.client.mainGuild)
        //else await this.client.application?.commands?.create(this.info)
    }

    /**
     * @param {discord.CommandInteraction} interaction
     */
    async exec(interaction) {
        let uptime = parseMS(this.client.uptime)

        await interaction.reply({
            embeds: [
                new discord.MessageEmbed().setColor(this.client.config.colors.default)
                .addField(
                    'Техническая информация',
                    `Использование ОЗУ:  \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} МБ\`\n` +
                    `Версия Node.JS: \`${process.version}\`\n` + 
                    `Версия Discord.JS: \`v${discord.version}\`\n` + 
                    `Версия бота: \`${version}\`\n` +
                    `Время работы: \`${uptime.days} : ${uptime.hours} : ${uptime.minutes} : ${uptime.seconds}.${uptime.milliseconds}\``
                ).setFooter({text: this.client.footerMaker(interaction)})
            ],
        })
    }
}

