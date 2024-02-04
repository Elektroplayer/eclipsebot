import { CommandInteraction } from "discord.js";
import Command from "../structures/Command.js";

export default class PingCommand extends Command {
    options = {
        name: 'help',
        description: 'Справка',
    }

    async exec(intr: CommandInteraction) {
        await intr.reply({content: "Справка доступна по [ссылке](<https://github.com/Elektroplayer/eclipsebot/wiki>)"});
    }
}