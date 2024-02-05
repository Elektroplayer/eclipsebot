import Event from "../structures/Event.js";
import Cache from "../lib/Cache.js";

export default class ReadyEvent extends Event {
    trigger = 'ready';

    exec() {
        console.log('Готов');

        // Cache.client.emit("guildMemberAdd", Cache.client.guilds.cache.get("718825766179045386")?.members.cache.get("1203365172010287104")!)
    }
}