import path from "path";
import Module from "../../structures/Module.js";
import fs from "fs";
import Cache from "../../lib/Cache.js";

const __dirname = path.dirname(import.meta.url.substring(7));

export default class GeneralModule extends Module {
    moduleName: string = "general";

    async init(): Promise<unknown> {
        await this.initCommands();
        await this.initEvents();

        // let modulePath  = path.resolve(__dirname, './');
        // console.log(fs.readdirSync(modulePath))

        return;
    }

    async initCommands() {
        let modulePath  = path.resolve(__dirname, './commands/');

        for(let cmdFileName of fs.readdirSync(modulePath)) {
            console.log(`[general] [commands] [+] ${cmdFileName}`);
            let cmd = new (await import(`./commands/${cmdFileName}`)).default();

            Cache.commands.push(cmd);
        }

        return;
    }

    async initEvents() {
        let modulePath  = path.resolve(__dirname, './events/');

        for(let eventFileName of fs.readdirSync(modulePath)) {
            console.log(`[general] [events] [+] ${eventFileName}`)
            let importedFile = (await import(`./events/${eventFileName}`)).default;

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

        return;
    }
}