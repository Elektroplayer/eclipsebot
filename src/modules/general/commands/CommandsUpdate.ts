import {
    CommandInteraction,
    SlashCommandBuilder,
    REST,
    Routes,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord.js';
import Command from '../../../structures/Command.js';
import Cache from '../../../lib/Cache.js';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
const clientId = '1203365172010287104';

export default class PingCommand extends Command {
    slashOptions = new SlashCommandBuilder().setName('cupdate').setDescription('Обновление команд');

    access = {
        global: false,
        guilds: ['718825766179045386'],
    };

    async exec(intr: CommandInteraction) {
        type req = RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody;

        let commands: req[] = [];
        let localCommands: { [key: string]: req[] } = {};
        let buffer: req[];

        for (let command of Cache.commands) {
            buffer = [];

            if (command.slashOptions) buffer.push(command.slashOptions.toJSON());
            if (command.contextOptions) buffer.push(command.contextOptions.toJSON());

            if (command.access.global) commands.push(...buffer);
            else if (command.access.guilds?.length) {
                command.access.guilds.forEach((guildId) => {
                    if (!localCommands[guildId]) localCommands[guildId] = [];
                    localCommands[guildId].push(...buffer);
                });
            }
        }

        await rest.put(Routes.applicationCommands(clientId), { body: commands });

        for (let key in localCommands) {
            await rest.put(Routes.applicationGuildCommands(clientId, key), { body: localCommands[key] });
        }

        // await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

        // Routes.applicationCommands(clientId)
    }
}
