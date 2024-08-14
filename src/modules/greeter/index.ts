import path from 'path';
import Module from '../../structures/Module.js';
import fs from 'fs';
import Cache from '../../lib/Cache.js';
import { ChannelType, CommandInteraction } from 'discord.js';
import MessagesModel from './models/MessagesModel.js';
import { format } from '../../lib/Utils.js';
import { ISchema, ITestResult } from '../autoSettings/index.js';

const __dirname = path.dirname(import.meta.url.substring(7));

// Схема для autoSettings
let schema: ISchema = {
    enabled: {
        test(value: string): ITestResult<boolean> {
            if (['true', 'false'].includes(value.toLowerCase()))
                return {
                    ok: true,
                    value: value.toLowerCase() == 'true',
                };
            else
                return {
                    ok: false,
                    message: 'Допустимые значения: true/false',
                };
        },
    },
    channelid: {
        test(value: string, intr: CommandInteraction): ITestResult<string> {
            let channel = intr.guild?.channels.cache.get(value);

            if (!channel || channel.type !== ChannelType.GuildText)
                return {
                    ok: false,
                    message: 'Канала не существует',
                };

            return { ok: true, value };
        },
    },
    message: {
        content: {
            test(value: string): ITestResult<string> {
                let fString = format(value, {
                    USERNAME: '11111111111111111111111111111111',
                    MENTION: `<@1111111111111111111>`,
                    GUILDNAME: '1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
                    COUNT: `1111`,
                });

                if (fString.length > 2000)
                    return {
                        ok: false,
                        message: 'Слишком большое сообщение',
                    };

                return { ok: true, value };
            },
        },
    },
};

export default class GeneralModule extends Module {
    async init(): Promise<unknown> {
        await this.initEvents();

        // Экспорт настроек в модуль autoSettings
        if (fs.readdirSync('./src/modules/').includes('autoSettings')) this.exportToAutoSettings();

        return;
    }

    async initEvents() {
        let modulePath = path.resolve(__dirname, './events/');

        for (let eventFileName of fs.readdirSync(modulePath)) {
            console.log(`[greeter] [events] [+] ${eventFileName}`);
            let importedFile = (await import(`./events/${eventFileName}`)).default;

            if (Array.isArray(importedFile)) {
                importedFile.forEach((cls) => {
                    let event = new cls();

                    Cache.client.on(event.trigger, event.exec.bind(event));
                });
            } else {
                let event = new importedFile();

                Cache.client.on(event.trigger, event.exec.bind(event));
            }
        }

        return;
    }

    async exportToAutoSettings() {
        let AS = (await import('../autoSettings/ModulesSettings.js')).default;

        AS.addSettingWithSchema('welcome', schema, MessagesModel, { type: 'Welcome' });
        AS.addSettingWithSchema('goodbye', schema, MessagesModel, { type: 'Goodbye' });
    }
}
