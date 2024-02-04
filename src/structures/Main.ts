import Cache from '../lib/Cache.js';
import fs from 'fs';

export default class Main {
    constructor() {
        Cache.client.login();
        this.initEvents();
        this.initCommands();
    }

    async initEvents() {
        for(let eventFileName of fs.readdirSync('./dist/events')) {
            console.log(`[loader] [events] [+] ${eventFileName}`)
            let importedFile = (await import(`../events/${eventFileName}`)).default;

            if(Array.isArray(importedFile)) {
                importedFile.forEach(cls => {
                    let event = new cls();

                    Cache.client.on(event.trigger, event.exec.bind(event));
                });
            } else {
                let event = new importedFile();

                Cache.client.on(event.trigger, event.exec.bind(event));
            }
        }
    }

    async initCommands() {
        for(let eventFileName of fs.readdirSync('./dist/commands')) {
            console.log(`[loader] [commands] [+] ${eventFileName}`)
            let cmd = new (await import(`../commands/${eventFileName}`)).default();

            Cache.commands.push(cmd);
        }
    }
}