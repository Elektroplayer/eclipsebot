import Module from '../../structures/Module.js';
import Cache from '../../lib/Cache.js';
import { ActivityType } from 'discord.js';

export default class StatusModule extends Module {
    async init(): Promise<unknown> {
        console.log('[simpleStatus] Модуль инициализирован!');

        Cache.client.on('ready', (client) => {
            client.user.setPresence({
                activities: [
                    {
                        name: 'аниме',
                        type: ActivityType.Watching,
                    },
                ],
                status: 'online',
            });

            console.log('[simpleStatus] Статус установлен!');
        });

        return;
    }
}
