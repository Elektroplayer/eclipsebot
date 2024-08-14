import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import Command from '../../structures/Command.js';
import ModulesSettings from './ModulesSettings.js';
import Messages from './Messages.js';
import { ITestResult } from './index.js';

function getValue(obj: any, key: string[]) {
    let buffer = obj;

    for (let i = 0; i < key.length; i++) {
        if (!buffer) break;
        buffer = buffer[key[i]];
    }

    return buffer;
}

function createObjectWithKey(key: string[], value: unknown): Record<string, unknown> {
    let [firstKey, ...restKeys] = key;
    return {
        [firstKey]: restKeys.length ? createObjectWithKey(restKeys, value) : value,
    };
}

export default class SettingsCommand extends Command {
    slashOptions = new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Настройки')
        .addStringOption((opt) => opt.setName('key').setDescription('Имя переменной').setRequired(true))
        .addStringOption((opt) => opt.setName('value').setDescription('Новое значение'));

    async exec(intr: CommandInteraction) {
        let key = `${intr.options.get('key')?.value}`.toLowerCase().split('.');
        let value: string | undefined = intr.options.get('value')?.value ? `${intr.options.get('value')?.value}` : undefined;

        let moduleSettings = ModulesSettings.settingsSchemas[key.shift()!];
        let schema = moduleSettings.schema;
        let model = moduleSettings.model;
        let filter = moduleSettings.filter;
        let settings = await model.findOne({ guildID: intr.guild?.id, ...filter }).exec();

        if (!value) {
            if (!getValue(schema, key)) Messages.unknownKey(intr);
            else if (!settings) Messages.sendValue(intr, 'Не назначено');
            else Messages.sendValue(intr, getValue(settings, key) ?? 'Не назначено');
        } else {
            let testFunc: (value: string, intr: CommandInteraction) => ITestResult<string> | undefined = getValue(schema, key)?.test;

            if (!testFunc) return Messages.keyReadOnly(intr);

            if (value == 'undefined') {
                // TODO: Сделать удаление данных при введении undefined

                return intr.reply({ content: 'Установка значения undefined ещё не достпуна' });
            }

            let testResult = testFunc(value, intr);

            if (!testResult) return Messages.unknownKey(intr);
            if (!testResult.ok) return Messages.invalidValue(intr, testResult?.message);

            let toUpdate = createObjectWithKey(key, testResult.value);

            if (toUpdate.enabled == undefined) toUpdate.enabled = true;

            await model
                .findOneAndUpdate({ guildID: intr.guild?.id, ...filter }, toUpdate, {
                    upsert: true,
                })
                .catch(console.log);

            Messages.successfully(intr, testResult.value);
        }
    }
}
