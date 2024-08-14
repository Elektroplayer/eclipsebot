import Module from '../../structures/Module.js';
import fs from 'fs';
import path from 'path';
import Cache from '../../lib/Cache.js';
import { ISchema, ITestResult } from '../autoSettings/index.js';
import { ChannelType, CommandInteraction } from 'discord.js';
import { format } from '../../lib/Utils.js';
import PrivateVoicesModel from './models/PrivateVoicesModel.js';

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

            if (!channel || channel.type !== ChannelType.GuildVoice)
                return {
                    ok: false,
                    message: 'Канала не существует',
                };

            return { ok: true, value };
        },
    },
    template: {
        test(value: string): ITestResult<string> {
            let fString = format(value, {
                USERNAME: '11111111111111111111111111111111',
                NICKNAME: '11111111111111111111111111111111',
            });

            if (fString.length > 100)
                return {
                    ok: false,
                    message: 'Слишком большое название канала',
                };

            return { ok: true, value };
        },
    },
};

export default class PRModule extends Module {
    async init(): Promise<unknown> {
        await this.initEvents();

        // Экспорт настроек в модуль autoSettings
        if (fs.readdirSync('./src/modules/').includes('autoSettings')) this.exportToAutoSettings();

        console.log('[privateVoices] Модуль инициализирован!');
        return;
    }

    async exportToAutoSettings() {
        let AS = (await import('../autoSettings/ModulesSettings.js')).default;

        if (AS) AS.addSettingWithSchema('privatevoices', schema, PrivateVoicesModel);
    }

    async initEvents() {
        let modulePath = path.resolve(__dirname, './events/');

        for (let eventFileName of fs.readdirSync(modulePath)) {
            console.log(`[privateVoices] [events] [+] ${eventFileName}`);
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
}
