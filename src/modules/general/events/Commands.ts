import { Interaction } from 'discord.js';
import Event from '../../../structures/Event.js';
import Cache from '../../../lib/Cache.js';
import { CommandTypes } from '../../../structures/Command.js';

export default [
    class CommandsEvent extends Event {
        trigger = 'interactionCreate';

        async exec(interaction: Interaction) {
            if (!interaction.isChatInputCommand() && !interaction.isUserContextMenuCommand()) return;

            let cmd = Cache.commands.find(
                (c) =>
                    (interaction.isChatInputCommand() && c.slashOptions?.name == interaction.commandName) ||
                    (interaction.isUserContextMenuCommand() && c.contextOptions?.name == interaction.commandName),
            );

            if (cmd) cmd.exec(interaction);
            else interaction.reply({ content: 'Похоже я где-то облажался, сорян.' });
        }
    },
];
