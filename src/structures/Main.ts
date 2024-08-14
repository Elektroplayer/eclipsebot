import Cache from '../lib/Cache.js';
import fs from 'fs';
import Module from './Module.js';

export default class Main {
    constructor() {
        Cache.client.login();

        this.initModules()
    }

    async initModules() {
        for(let dirName of fs.readdirSync('./dist/modules/')) {
            console.log(`[loader] [modules] [+] ${dirName}`)
            let module: Module = new (await import(`../modules/${dirName}/index.js`)).default();

            module.init();
        }
    }
}