/*
  Тут находится некоторая пародия на норм документацию)
  В любом случае она может даже помочь

  Данный файл отвечает за практически все ошибки, если не за все.
  Большинство ошибок сразу дают нужный текст, например такие как ownerOnly.
  Некоторым можно добавить описание, но оно не обязательно.
  Первым аргументов всегда должен быть message!
  Далее дополнительные аргументы.
  Изменять можно только текст и даже в таком случае лучше помолиться лишний раз.
*/

const discord  = require('discord.js');
const CONFIG   = require('../config.json');
const UTILS    = require('./utils.js');

module.exports = {

    /**
     * Если человек забыл про какие-то важные аргументы. 
     * Текст: Недостаточно аргументов!
     * @param {discord.Message} message
     * @param {String} desc
    */
    notArgs: (message,desc) => {
        let emb = new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle('Недостаточно аргументов!');
        if(desc) emb.setDescription(desc);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Если человек запутался в аргументах. 
     * Текст: Предоставлены неверные аргументы!
     * @param {discord.Message} message
     * @param {String} desc
    */
    falseArgs: (message,desc) => {
        let emb = new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle('Предоставлены неверные аргументы!');
        if(desc) emb.setDescription(desc);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * У человека не достаточно прав и ты хочешь предупредить об этом. 
     * Текст: У тебя не достаточно прав!
     * или если есть второй аргумент: Для использования этой команды у тебя не достаточно этих прав: `права`
     * @param {discord.Message} message
     * @param {Array<discord.Permissions} permissions
    */
    notPerms: (message, permissions) => {
        message.channel.send(
            new discord.MessageEmbed().setColor(CONFIG.colors.errorRed)
            .setTitle(permissions || permissions.length != 0 ? `Для использования этой команды у тебя не достаточно этих прав: \`${ UTILS.stringifyPermissions(permissions) }\`` : "У тебя не достаточно прав!")
        ).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * У бота не достаточно прав и ты хочешь предупредить об этом. 
     * Текст: У меня не достаточно прав!
     * или если есть второй аргумент: Для использования этой команды у меня не достаточно этих прав: `права`
     * @param {discord.Message} message
     * @param {Array<discord.Permissions} permissions
    */
    botNotPerms: (message, permissions) => {
        message.channel.send(
            new discord.MessageEmbed().setColor(CONFIG.colors.errorRed)
            .setTitle(permissions || permissions.length != 0 ? `Для использования этой команды у меня не достаточно этих прав: \`${ UTILS.stringifyPermissions(permissions) }\`` : "У меня не достаточно прав!")
        ).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Если это для обычных людей. 
     * Текст: Эта функция доступна только создателям бота!
     * @param {discord.Message} message
    */
    ownerOnly: (message) => {
        message.channel.send(
            new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle('Эта функция доступна только создателям бота!')
        ).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Для настроек. Если какой-то параметр уже установлен на это же. 
     * Текст: Значение этого параметра уже установлено `значение`.
     * @param {discord.Message} message
     * @param {String} par
    */
    equalParameters: (message, par) => {
        message.channel.send(
            new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle(`Значение этого параметра уже установлено \`${par}\`!`)
        ).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Текст: Такого пользователя не существует!
     * @param {discord.Message} message
    */
    noUser: (message)=> {
        let emb = new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle('Такого пользователя не существует!');
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Текст: Такого канала не существует!
     * @param {discord.Message} message
    */
    noChannel: (message)=> {
        let emb = new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle('Такого канала не существует!');
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Текст: Такой роли не существует!
     * @param {discord.Message} message
    */
    noRole: (message)=> {
        let emb = new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle('Такой роли не существует!');
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Создание кастомной ошибки
     * @param {discord.Message} message
     * @param {String} title
     * @param {String} desc
    */
    custom: (message,title,desc) => {
        let emb = new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle(title);
        if(desc) emb.setDescription(desc);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * По сути, это не ошибка. 
     * @param {discord.Message} message
     * @param {String} title
     * @param {String} desc
    */
    success: (message,title,desc) => {
        let emb = new discord.MessageEmbed().setColor(CONFIG.colors.successGreen).setTitle(title);
        if(desc) emb.setDescription(desc);
        message.channel.send(emb);
    },

    /**
     * Если API не ответил. 
     * Текст: Неполадки с API! Попробуйте позже...
     * @param {discord.Message} message
    */
    APIErrors: (message) => {
        let emb = new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle('Неполадки с API! Попробуйте позже...');
        message.channel.send(emb);
    },

    //  Не используется
    // baseErr: (message,value) => {
    //     let emb = new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle(value ? `Ошибка базы данных! Значение: ${value}` : `Ошибка базы данных!`)
    //     .setDescription(`Обновите конфигурацию! \`e.settings configurationUpdate\``);
    //     message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    // },

    /**
     * Функция не работает сейчас. 
     * Текст: Эта функция не работает сейчас! Следите за обновлениями) \`e.ver\`
     * @param {discord.Message} message
    */
    doNotWorksNow: (message) => {
        let emb = new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle(`Эта функция не работает сейчас!`)
        .setDescription(`Следите за обновлениями) \`${CONFIG.prefix}ver\``);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Неизвестная ошибка. 
     * Текст: Произошла неизвестная ошибка
     * @param {discord.Message} message
     * @param {String} desc
    */
    unknown: (message,desc) => {
        let emb = new discord.MessageEmbed().setColor(CONFIG.colors.errorRed).setTitle("Произошла неизвестная ошибка");
        if(desc) emb.setDescription(desc);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    }
}