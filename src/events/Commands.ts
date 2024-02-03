import { Client, Interaction } from "discord.js";
import Event from "../structures/Event.js";
import Cache from "../lib/Cache.js";

export default class CommandsEvent extends Event {
    trigger = "interactionCreate";

    async exec(interaction:Interaction) {
        if (!interaction.isChatInputCommand()) return;

        let cmd = Cache.commands.find(c => c.options.name == interaction.commandName)

        if(cmd) cmd.exec(interaction);
        else interaction.reply({ content: "Похоже я где-то облажался, сорян." });

        // if (interaction.commandName === 'ping') {
        //     await interaction.reply('Pong!');
        // }
    }
}