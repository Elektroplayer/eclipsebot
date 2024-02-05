import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default abstract class Command {
    abstract options:Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

    abstract exec(intr:CommandInteraction):any;
}