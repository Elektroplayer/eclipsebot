import { Client, GatewayIntentBits } from "discord.js";
import Command from "../structures/Command"

export default new (class Cache {
    commands:Command[] = [];
    client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
})();
