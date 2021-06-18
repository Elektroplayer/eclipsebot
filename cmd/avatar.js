const CONFIG   = require("../config.json");
const UTILS    = require("../lib/utils.js");
const ERRORS   = require("../lib/errors.js");
const discord  = require('discord.js');

// eslint-disable-next-line no-unused-vars
const Client = require("../lib/client.js");

module.exports = {
    /**
     * @param {discord.Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    run: (bot,message,args)=> {

        let options = { dynamic: true, size: 4096 };
        let footer  = CONFIG.templates.footer.replace('USERNAME', message.author.username);

        if(!args[0]) {
            return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`Вот твой аватар:`).setDescription(`[Если не загрузилось](${message.author.avatarURL(options) || message.author.defaultAvatarURL})`).setImage(message.author.avatarURL(options) || message.author.defaultAvatarURL).setFooter(footer));
        } else if(args[0] == "server") {
            if(!message.guild.iconURL({ dynamic: true, size: 512 })) return ERRORS.custom(message,`Сервер не имеет аватарки!`);
            return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`Аватарка сервера`).setDescription(`[Если не загрузилось](${message.guild.iconURL(options)})`).setImage(message.guild.iconURL(options)).setFooter(footer));
        } else {
            let member = UTILS.findMembers(message, args[0])
            if(member.length == 0) return ERRORS.noUser(message);
            if(member.length == 1) return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`Аватар пользователя ${member[0].user.username}:`).setDescription(`[Если не загрузилось](${member[0].user.avatarURL(options) || member[0].user.defaultAvatarURL})`).setImage(member[0].user.avatarURL(options) || member[0].user.defaultAvatarURL).setFooter(footer));
            
            let embed = new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle('Я нашёл нескольких похожих людей...').setFooter(footer);
            let descText = `Выбор **${CONFIG.prefix}<номер>**\n\n`, i = 1;
            member.forEach( elm => {
                descText += `${i}. <@!${elm.id}>\n`;
                i++;
            });

            message.channel.send(embed.setDescription(descText)).then(msg => {
                let filter     = (collectedMsg) => collectedMsg.author.id == message.author.id && message.content.startsWith(CONFIG.prefix);
                let collector  = msg.channel.createMessageCollector(filter, {max: 1, idle: 10000});
    
                collector.on('collect', (m) => {
                    m.delete();
                    msg.delete();

                    if(!/^\d+$/.test(m.content.slice(2)) ) return ERRORS.custom(message,'Это не цифра!');
                    if(!member[parseInt(m.content.slice(2))-1]) return ERRORS.custom(message,'Этого варианта нету!');

                    let finMember = member[parseInt(m.content.slice(2))-1];

                    return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`Аватар пользователя ${finMember.user.username}:`).setDescription(`[Если не загрузилось](${finMember.user.avatarURL(options) || finMember.user.defaultAvatarURL})`).setImage(finMember.user.avatarURL(options) || finMember.user.defaultAvatarURL).setFooter(footer));
                });

                collector.on('end', c => {
                    if(c.size == 0) {
                        msg.delete();
                        return ERRORS.custom(message,'Время истекло!');
                    }
                })
            })
        }
    },
    name: ["avatar", "ava"],
    description: "Показать аватар",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Общее",
        arguments: "**<user || автор>** - Покажет аватар упомянутого пользователя, а если упоминания нет, то покажет аватар автора *(Можно ввести ID или имя)*",
        examples: `**${CONFIG.prefix}avatar** - Покажет твой аватар\n**${CONFIG.prefix}avatar @user** - Покажет аватар упомянутого пользователя\n**${CONFIG.prefix}avatar 111111123456789101** - Покажет аватар пользователя с таким ID\n**${CONFIG.prefix}avatar UserName** - Покажет аватар пользователя с таким именем *(НЕ НИКОМ НА СЕРВЕРЕ)*\n**${CONFIG.prefix}avatar server** - Покажет аватар сервера`
    }
}