import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "../structures/Command.js";

export default class PingCommand extends Command {
    options = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!')

    async exec(intr: CommandInteraction) {
        await intr.reply({content: "Pong!"});
    }
}