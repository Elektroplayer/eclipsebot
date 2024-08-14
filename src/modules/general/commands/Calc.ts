import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../../structures/Command.js';
import { evaluate } from 'mathjs';

export default class PingCommand extends Command {
    slashOptions = new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Калькулятор')
        .addStringOption((opt) => opt.setName('solve').setDescription('Алгебраический пример').setRequired(true));

    async exec(intr: CommandInteraction) {
        let result;
        try {
            result = evaluate(`${intr.options.get('solve')!.value}`);
        } catch (error) {
            result = 'Ошибка!';
        }
        if (typeof result === 'function') result = 'Ошибка!';

        let resultString = `**Дано:**\n\`\`\` ${`${intr.options.get('solve')!.value}`.replaceAll('`', '\\`')} \`\`\`\n**Ответ:**\`\`\`${result}\`\`\``;

        if (resultString.length > 2000) result = 'Слишком большое выражение!';

        intr.reply({
            content: resultString,
        });
    }
}
