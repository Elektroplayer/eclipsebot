import { CommandInteraction } from "discord.js";
import Cache from "../../lib/Cache.js";
import Command from "../../structures/Command.js";
import Module from "../../structures/Module.js";

export interface ITestResult<T> {
    ok: boolean;
    value?: T;
    message?: string;
}

export interface ISchema {
    [key: string]: {
        test: (value: string, intr: CommandInteraction) => ITestResult<unknown>
    } | ISchema | undefined
}

export default class SettingsModule extends Module {
    moduleName: string = 'autoSettings';

    async init(): Promise<unknown> {
        let command:Command = new (await import("./Command.js")).default();

        Cache.commands.push(command);

        console.log('[autoSettings] Модуль инициализирован');
        
        return;
    }
}