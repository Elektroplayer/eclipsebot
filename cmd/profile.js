const discord    = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Client     = require("../lib/client.js");
const strftime   = require("strftime").localizeByIdentifier('ru_RU');
const CONFIG     = require('../config.json');
const UTILS      = require('../lib/utils.js');
const ERRORS     = require('../lib/errors.js');

/**
 * @param {discord.Message} message 
 * @param {discord.GuildMember} member
 */
function go (message, member) {

    //  Все даты
    let day   = 1000 * 60 * 60 * 24
    let date1 = new Date(message.createdTimestamp)
    let date2 = new Date(member.user.createdTimestamp)
    let date3 = new Date(member.joinedTimestamp)
    let diff1 = Math.round(Math.abs((date1.getTime() - date2.getTime()) / day))
    let diff2 = Math.round(Math.abs((date1.getTime() - date3.getTime()) / day))

    let nickname   = member.nickname ? ` aka ${member.nickname}` : ""; //  Если есть никнейм, то мы его записываем, если нет, то его видно не будет
    let roles      = member.roles.cache.filter((r) => r.id !== message.guild.id) //  Находим роли у человека на сервере
    .sort((a, b) => b.rawPosition - a.rawPosition) //  Сортируем
    .map((r) => r).join(", ") || "Отсутствуют"; //  Если роли есть, у нас будет весь список, если нет, то напишет "Отсутствуют"

    let roleCount = member.roles.cache.filter((r) => r.id !== message.guild.id).size; //  Находим количество ролей

    let profileEmbed = new discord.MessageEmbed().setTitle(member.user.username + nickname).setColor(CONFIG.colors.default)
    .addField('Дата регистрации:', `${strftime('%B %d, %Y год в %H:%M', date2)}\n(${diff1} дней назад)`,true)
    .addField('Подключился на сервер:', `${strftime('%B %d, %Y год в %H:%M', date3)}\n(${diff2} дней назад)`,true)
    .addField(`ID:`,`${member.id}`)
    .addField(`Роли (${roleCount}):`, `${roles}`)
    .setThumbnail(member.user.avatarURL({ dynamic: true, size: 512 })|| member.user.defaultAvatarURL)
    .setFooter(CONFIG.colors.default); //  Создаём embed. Создал его сразу для своего удобства, потом не придётся писать это снова

    let statuses = {online: `В сети`, idle: `Не активен`, dnd: `Не беспокоить`, offline: `Не в сети`} //  Облегчаем себе жизнь
    let game
    if(message.guild.presences.cache.get(member.id)) {
        game = `\`\`\`${statuses[message.guild.presences.cache.get(member.id).status]}\`\`\``; //  Вычисляем в сети ли он или нет
        if(game == `\`\`\`Не в сети\`\`\``) return message.channel.send(profileEmbed.addField(`Имеет статус:`, `\`\`\`${statuses[member.presence.status]}\`\`\``)); //  Если нет, то на этом заканчиваем
    } else return message.channel.send(profileEmbed.addField(`Имеет статус:`, `\`\`\`${statuses[member.presence.status]}\`\`\``)) //  Если у нас нет его действий, то заканчиваем тоже

    let text = `` //  Узнаем, откуда он активен
    if(message.guild.presences.cache.get(member.id).clientStatus.web) text = text + `Браузера\n`
    if(message.guild.presences.cache.get(member.id).clientStatus.mobile) text = text + `Телефона\n`
    if(message.guild.presences.cache.get(member.id).clientStatus.desktop) text = text + `Компьютера\n`

    let activit  = message.guild.presences.cache.get(member.id).activities; //  Да, я умею называть переменные)
    let activ    = '';

    activit.forEach (elm => {
        if (elm.type == 'CUSTOM_STATUS') { //  К кастомному статусу отдельная надпись
            let stat = ""
            if(elm.emoji) stat += " " + elm.emoji.name; 
            if(elm.state) stat += " " + elm.state
            activ += ` \`\`\`Кастомный статус:${stat}\`\`\` `
        } else {
            activ += ` \`\`\`Имя: ${elm.name}\n${elm.details ? elm.details + "\n" : ""}${elm.state ? elm.state : ""}\`\`\` `
        }
    })

    if(activ == '') activ = '```Нет```' //  Если активностей нет, то и сюда нет...

    message.channel.send(profileEmbed.addField(`Активен с`,`${text}`).addField(`Активности:`, activ)) //  Отправляем конечный embed
}

module.exports = {
    /**
     * @param {Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    run: (bot,message,args)=> {

        if(!args[0]) return go (message, message.member)
        // Получаем пользователя, о котором идёт речь

        let member = UTILS.findMembers(message, args[0])
        if(member.length == 0) return ERRORS.noUser(message);
        if(member.length == 1) return go(message, member[0])
        
        let embed = new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Я нашёл нескольких похожих людей...').setFooter(CONFIG.templates.footer.replace('USERNAME', message.author.username));
        
        let bufferMember = [];
        for(let i=0;i<member.length;i++) {
            bufferMember[i] = `<@!${member[i].id}>`
        }

        message.channel.send(embed.setDescription(`Выбор **${CONFIG.prefix}<номер>**\n\n` + UTILS.stringifyArray(bufferMember,'I. ', '\n'))).then(msg => {
            let filter     = (collectedMsg) => collectedMsg.author.id == message.author.id && message.content.startsWith(CONFIG.prefix);
            let collector  = msg.channel.createMessageCollector(filter, {max: 1, idle: 10000});

            collector.on('collect', (m) => {
                m.delete();
                msg.delete();

                if(!/^\d+$/.test(m.content.slice(2)) ) return ERRORS.custom(message,'Это не цифра!');
                if(!member[parseInt(m.content.slice(2))-1]) return ERRORS.custom(message,'Этого варианта нету!');

                let finMember = member[parseInt(m.content.slice(2))-1];

                return go(message, finMember)
            });

            collector.on('end', c => {
                if(c.size == 0) {
                    msg.delete();
                    return ERRORS.custom(message,'Время истекло!');
                }
            })
        })
    },
    name: ["profile","me"],
    description: "Информация о человеке",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Прочее",
        arguments: `**<user || автор>** - Покажет информацию о пользователе *(Можно ввести ID или имя)*`,
        examples: `**${CONFIG.prefix}profile** - Покажет информацию о тебе\n**${CONFIG.prefix}profile @user** -  Покажет информацию об упомянутом пользователе\n**${CONFIG.prefix}profile 111111123456789101** - Покажет информацию о пользователе с таким ID\n**${CONFIG.prefix}profile UserName** - Покажет информацию о пользователе с таким именем *(НЕ НИКОМ НА СЕРВЕРЕ)*`
    }
}