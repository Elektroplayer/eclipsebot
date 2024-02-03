import { CommandInteraction } from "discord.js";
import Command from "../structures/Command.js";

export default class PingCommand extends Command {
    options = {
        name: 'ping',
        description: 'Replies with Pong!',
    }

    async exec(intr: CommandInteraction) {
        await intr.reply({content: "Pong!"});
    }
}