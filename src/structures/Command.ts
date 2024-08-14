import { CommandInteraction, ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

export enum CommandTypes {
    Chat = 1,
    User = 2,
    Message = 3,
}

export default abstract class Command {
    slashOptions?: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder; // Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup" | "addStringOption">;
    contextOptions?: ContextMenuCommandBuilder;

    access: { global: boolean; guilds?: string[] } = {
        global: true,
    };

    abstract exec(intr: CommandInteraction): any;
}
