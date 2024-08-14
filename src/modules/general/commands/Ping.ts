import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../../structures/Command.js';

export default class PingCommand extends Command {
    slashOptions = new SlashCommandBuilder().setName('ping').setDescription('Pong!');

    access = {
        global: false,
        guilds: ['718825766179045386'],
    };

    async exec(intr: CommandInteraction) {
        await intr.reply({ content: 'Pong!' });
    }
}
