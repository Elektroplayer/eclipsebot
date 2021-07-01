const discord   = require('discord.js');
const strftime  = require('strftime').localizeByIdentifier('ru_RU');
const CONFIG    = require('../config.json');
// eslint-disable-next-line no-unused-vars
const Client    = require('../lib/client.js');

function parseMS (milliseconds) {
    let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
    return {
        days: roundTowardsZero(milliseconds / 86400000),
        hours: roundTowardsZero(milliseconds / 3600000) % 24,
        minutes: roundTowardsZero(milliseconds / 60000) % 60,
        seconds: roundTowardsZero(milliseconds / 1000) % 60,
        milliseconds: roundTowardsZero(milliseconds) % 1000
    };
}

module.exports = {
    /**
     * @param {discord.Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    run: (bot,message,args)=> {
        if(args[0] == "tegnio") {
            let embed = new discord.MessageEmbed().setColor(CONFIG.colors.default)
            .setTitle("Информация о боте")
            .addField("Основное",
                        `П0льз%вателей: \`0000\`\n` +
                        `Сервер0в: \`0000\`\n` + 
                        `Д$та с%здания: \`NaN\`\n` +
                        `Вре%я ра$0ты: \`?? : ?? : ?? : ??.???\``
            ).addField(`~~undef!ned~~ эт0:`,
                        "**Участниk~~и~~:**\n" +
                        "~~`[Electr0Player]#0256` - GOVNOРаз$аб0тчиk, I NE владелец пр0еkта\n" +
                        "`L00k!ns#4727` - Т0стер0вщиk, б$гs ON, хантер\n" +
                        "`d1%0s23#1080` - GOV$OРаз^аб0тчиk сaй%а (сейча^ пилит е$0 д0 k0нц%, NO NIK$G%^ NEee///)\n~~" +
                        "`T͉͛Ẻ͖͓̪͙̔̚͝G̞͚̽̕!̛͉͙̺̃͂O - %CH^$TNIK TOLKO ODI%`" +
                        "\n" +
                        "**0%0бы~~е л$ди~~ CHELOVEK**\n" +
                        "`YA` - ${ERR0R0x0000015}\n" +
                        "`YA` - ${ERR0R0x0000016}\n" +
                        "`YA` - ${ERR0R0x0000017}\n" +
                        "`YA` - ${ERR0R0x0000018}\n" +
                        "`YA` - ${ERR0R0x0000019}\n" +
                        "\n" +
                        "**Д0натеры**\n" +
                        "~~`Xȃ̗͉͞l̘̬̊̆!̧̺͑̀k̞͗s̨͔̬̦̀̆̐̓#5̯̬̗̱̊̎͗͘5́ͅ0̯̓1`~~ - 00 рублей\n" +
                        "~~`S͈͙̈́͗͘͟a̞̩̓̐ñ̗̣͔̩͑͠͝d̥̉0r̫̘̣̜̈́͌̽̒!̡͓͕͍̍̋͗͌k#̮̓6̠̼̋̊̓͟1̢̘̋͞8̣̣̥̯̏̆̋͐6͖̩̲̞̈̓͐͘`~~ - 00 рубля\n" +
                        "`T̙̊e͇̱͋͋g̬̜̭̉͂̾n̻͆!̹̼̞͛̒̄͐͜0͙̦͒̑͝ͅ#͔̺͌̓6̰̺̉͘5̫̇4͇̦̾͛6͇̖̎̌͘ͅ` - OVER9999 рублей\n" +
                        "~~`w̤̽ỷ͔̭͈̃̆́͢l!͖̆t̫̥͕͆̋̓̍ͅe̦͉͇̐́͝#̢̘̉͠0͓̔̐͜0̗̋̏͟0̡̫͒͑͂ͅ1̱̱̉͊`~~ - 00 рублей\n"
            )
            .addField("П0л̮̀е3̟̈н̣̂ы̲̚е͖̋ с̩͊сы͈͊лk͕͡и", `E͇͑RR͉̀0̜́R\nEṚ͂R0R̰͆\nER̭͗Ȓ͎0R̟̋\nÊ͙R̳͡RO̪͋Ṛ̊`,true)
            .addField("М͉̃0̽ͅн̧̿и%0̳͒р̣͑инг̘͌ӥ̮́ (NE~~пр0~~г0л0суй >:@#№):", "NE͙̪̔̎T̹̼̓̕͢͠ P̢̳̪̆͑̅OD̢̊͆ͅER̙̊J͎̬̌̒Ḱ̼̪̔E̞̓",true)
            .setFooter(CONFIG.templates.footer.replace('USERNAME', `T͍͔͊̔͟͟͡͞Ê͇̬͉͂͘G̬̬̿͝!̮̃Ő̦͇͍̂͌`));
        
            message.channel.send(embed);

            return;
        }

        let uptime = parseMS(bot.uptime);
        let embed = new discord.MessageEmbed().setColor(CONFIG.colors.default)
        .setTitle("Информация о боте")
        .addField("Основное",
                    `Пользователей: \`${bot.users.cache.size}\`\n` +
                    `Серверов: \`${bot.guilds.cache.size}\`\n` + 
                    `Дата создания: \`${strftime('%d.%m.%Y год в %H:%M', new Date(bot.user.createdTimestamp))}\`\n` +
                    `Время работы: \`${uptime.days} : ${uptime.hours} : ${uptime.minutes} : ${uptime.seconds}.${uptime.milliseconds}\``
        ).addField(`Night Devs это:`,
                    "**Участники:**\n" +
                    "`[ElectroPlayer]#0256` - Разработчик, владелец проекта\n" +
                    "`Lookins#4727` - Тестеровщик, баг хантер\n" +
                    "`d1m0s23#1080` - Разработчик сайта (сейчас пилит его до конца)\n" +
                    "\n" +
                    "**Особые люди**\n" +
                    "`Lokilife#7962` - Бывший участник. Очень продвинул разработку бота и улучшил мои познания в JS. *Спасибо...*\n" +
                    "`GitRonin#8012` - Разработчик большей Front-End части сайта\n" +
                    "`[Ueuecoyotl]#4032` - Бывший редактор\n" +
                    "`𝓐𝓤𝓣𝓞𝓟𝓛𝓐𝓨𝓔𝓡 [BF]#4324` - Дал хост на первое время\n" +
                    "`wylite#0001` - Помог с оптимизацией интентов\n" +
                    "\n" +
                    "**Донатеры**\n" +
                    "`Xaliks#5501` - 70 рублей\n" +
                    "`Sandorik#6186` - 52 рубля\n" +
                    "`Tegnio#6546` - 10 рублей\n" +
                    "`wylite#0001` - 6 рублей\n"
        ).addField("Полезные ссылки", `[Сервер поддержки](https://discord.gg/PHuvYMrvdr)\n[GitHub бота](https://github.com/Elektroplayer/eclipsebot)\n[Ссылка на бота](https://discord.com/api/oauth2/authorize?client_id=769659625129377812&permissions=${CONFIG.authCode}&scope=bot)\n[На чай](https://www.donationalerts.com/r/electroplayer)`,true)
        .addField("Мониторинги (проголосуй :з):", "[top.gg](https://top.gg/bot/769659625129377812/vote)\n[boticord](https://boticord.top/bot/769659625129377812)\n[bots.server-discord](https://bots.server-discord.com/769659625129377812)\n[topcord](https://bots.topcord.ru/bots/769659625129377812/vote)",true)
        .setImage("https://imgur.com/gVF57ny.png")
        .setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username));
    
        message.channel.send(embed);

        return;
    },
    name: ["info","bot", "botinfo"],
    description: "Информация о боте",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Прочее",
        arguments: "**Нет**",
        examples: `**${CONFIG.prefix}info** - Информация о боте`
    }
}