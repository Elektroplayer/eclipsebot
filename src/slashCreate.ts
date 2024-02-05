import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

let commands:SlashCommandBuilder[] = [];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

for(let eventFileName of fs.readdirSync('./dist/commands')) {
    console.log(`[updater] ${eventFileName}`)
    let cmd = new (await import(`../dist/commands/${eventFileName}`)).default();

    commands.push(cmd.options.toJSON())
}

let guildId = "718825766179045386"
let clientId = "1203365172010287104"

try {
    console.log('[updater] Обновляю команды');

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

    console.log('[updater] Успешно!');
} catch (error) {
    console.error(error);
}