/* eslint-disable no-case-declarations */
const discord = require('discord.js');
const ERRORS  = require('../lib/errors.js');
const CONFIG  = require('../config.json');

function getRandomInRange(first, second) {
    const check = first > second,
          min = check ? second : first,
          max = check ? first  : second
    return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
    run: (bot,message,args)=> {
        
        if(!args[0]) return ERRORS.notArgs(message, `Напиши **${CONFIG.prefix}help random** для помощи по команде`)

        switch (args[0]) {
            case "word":
                if(!args[1] || !args[2]) return ERRORS.notArgs(message,"А из чего выбирать?")

                for(let i = 1;i<args.length;i++) {
                    if(args[i].length > 250) return ERRORS.falseArgs(message, "Слово не может быть длиннее 250 символов!")
                }

                message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`${args[(Math.floor( Math.random() * (args.length-1) )+1)]}`))
            break;

            case "number":
                if(!args[1]) return ERRORS.notArgs(message);

                if(args[1] && !args[2]) {
                    if(!/^[-]?\d+$/.test(args[1])) return ERRORS.falseArgs(message, "Разрешены только числа!")
                    if(args[1]>999999 || args[1]<-999999) return ERRORS.falseArgs(message, "Число не должно быть больше 999999")
                    message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`${Math.floor(Math.random() * args[1])}`))
                }
                else if(args[1] && args[2]) {
                    if(!/^[-]?\d+$/.test(args[1])||!/^[-]?\d+$/.test(args[2])) return ERRORS.falseArgs(message, "Разрешены только числа!")
                    if(args[1]>999999 || args[1]<-999999 || args[2]<-999999 || args[2]>999999) return ERRORS.falseArgs(message, "Число не должно быть больше 999999");
                    if(args[1]==args[2]) return message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`${args[1]}`))
                    message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`${getRandomInRange(Number(args[1]), Number(args[2]))}`))
                } else return ERRORS.unknown(message);

            break;

            case "user":
                message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setTitle(`${message.guild.members.cache.random().user.tag}`))
            break;

            case "color":
                let color = '#'
                for (var i = 0; i < 6; i++) {
                    color += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
                }
                message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setColor(color).setTitle(`Случайный цвет:`).setDescription(color))
            break;

            case "8ball":
                let answers = [
                    { text: "Бесспорно", color: "0000ff" },{ text: "Предрешено", color: "0000ff" },{ text: "Никаких сомнений", color: "0000ff" },{ text: "Определённо да", color: "0000ff" },{ text: "Можешь быть уверен в этом", color: "0000ff" },
                    { text: "Мне кажется — «да»", color: "00ff00" },{ text: "Вероятнее всего", color: "00ff00" },{ text: "Хорошие перспективы", color: "00ff00" },{ text: "Знаки говорят — «да»", color: "00ff00" },{ text: "Да", color: "00ff00" },
                    { text: "Пока не ясно, попробуй снова", color: "FFA500" },{ text: "Спроси позже", color: "FFA500" },{ text: "Лучше не рассказывать", color: "FFA500" },{ text: "Сейчас нельзя предсказать", color: "FFA500" },{ text: "Сконцентрируйся и спроси опять", color: "FFA500" },
                    { text: "Даже не думай", color: "ff0000" },{ text: "Мой ответ — «нет»", color: "ff0000" },{ text: "По моим данным — «нет»", color: "ff0000" },{ text: "Перспективы не очень хорошие", color: "ff0000" },{ text: "Весьма сомнительно", color: "ff0000" },
                ]
                
                let rand = answers[Math.floor(Math.random()*20)];
                message.channel.send(new discord.MessageEmbed().setColor(CONFIG.colors.default).setColor(rand.color).setTitle(rand.text))
            break;

            default:
                ERRORS.falseArgs(message)
            break;
        }
    },
    name: ["random","rand"],
    description: "Рандомайзер чего-либо",
    show: true,
    ownerOnly: false,
    permissions: {
        bot: [],
        member: []
    },
    help: {
        category: "Общее",
        arguments: `**word <Слова из которых нужно выбрать>** - Выберет рандомное слово из заданных\n**8ball** - Магический шар, отвечающий на вопросы\n**number <x>** - Выберет рандомное число от 0 до x\n**number <x> <y>** - Выберет рандомное число от x до y\n**user** - Рандомный человек с сервера\n**color** - Рандомный цвет\n\n*`,
        examples: `**${CONFIG.prefix}random word Кошка Кошечка Киска** - Выберет рандомное слово из предложенных\n**${CONFIG.prefix}random number 10** -  Рандомное число от 0 до 10\n**${CONFIG.prefix}random number 5 10** -  Рандомное число от 5 до 10\n**${CONFIG.prefix}random user** - Выберет рандомного человека\n**${CONFIG.prefix}random color** - Даст рандомный цвет`
    }
}