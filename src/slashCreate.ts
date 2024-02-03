import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationGuildCommands("1203365172010287104", "718825766179045386"), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}