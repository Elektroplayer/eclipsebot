/* eslint-disable no-unused-vars */
const Client = require('./client.js');
const { Message } = require('discord.js');

/**
 * Класс команды, значительная часть бота
 * без которой команды не будут работать.
*/
 class Command {
    /**
     * @param {CommandOptions} options
     */
    constructor(options = {}) {
        /**
         * @param {Client} bot
         * @param {Message} message
         * @param {Array.<String>} args
        */
        this.run = options.run;

        /**
         * @type {Array<String>}
        */
        this.name = options.name;

        /**
         * @type {String}
        */
        this.description = options.description;

        /**
         * @type {Boolean}
        */
        this.show = options.show;

        /**
         * @type {Boolean}
        */
        this.ownerOnly = options.ownerOnly;

        /**
         * @type {{bot: Array.<String>, member: Array.<String>}}
        */
        this.permissions = options.permissions;

        /**
         * @type {{category: String, arguments: String, examples: String}}
        */
        this.help = options.userPermissions;

    }
}

module.exports = Command;