const CONFIG = require('../config.json');

module.exports = {
    run: (bot,message,args) => {
        args;
        //  CODE
    },
    name: ["commandName", "anotherCommandName"],
    description: "Command description",
    show: false,
    ownerOnly: true,
    permissions: {
        bot: ['perms', 'for', 'bot'],
        member: ['perms', 'for', 'member']
    },
    help: {
        category: "Other",
        arguments: "**Nope**",
        examples: `${CONFIG.prefix}commandName - Nothing change...`
    }
}

//  In English potomu chto ya mogu

