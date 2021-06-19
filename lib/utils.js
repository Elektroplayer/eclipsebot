// eslint-disable-next-line no-unused-vars
const discord   = require('discord.js');
const fetch     = require('node-fetch');

const permissions = {
    "ADMINISTRATOR":            "Администратор",
    "CREATE_INSTANT_INVITE":    "Создавать приглашение",
    "KICK_MEMBERS":             "Выгонять участников",
    "BAN_MEMBERS":              "Банить участников",
    "MANAGE_CHANNELS":          "Управлять каналами",
    "MANAGE_GUILD":             "Управлять сервером",
    "ADD_REACTIONS":            "Добавлять реакции",
    "VIEW_AUDIT_LOG":           "Просматривать аудит",
    "PRIORITY_SPEAKER":         "Приоритетный режим",
    "VIEW_CHANNEL":             "Просматривать канал",
    "SEND_MESSAGES":            "Отправлять сообщения",
    "SEND_TTS_MESSAGES":        "Отправлять Text-To-Speech сообщения",
    "MANAGE_MESSAGES":          "Управлять сообщениями",
    "ATTACH_FILES":             "Отправлять файлы",
    "READ_MESSAGE_HISTORY":     "Просматривать историю сообщений",
    "MENTION_EVERYONE":         "Упоминание `@everyone`, `@here`",
    "USE_EXTERNAL_EMOJIS":      "Использовать внешние эмодзи",
    "VIEW_GUILD_INSIGHTS":      "Просматривать аналитику сервера",
    "MUTE_MEMBERS":             "Отключать участникам микрофон",
    "DEAFEN_MEMBERS":           "Отключать участникам звук",
    "MOVE_MEMBERS":             "Перемещать участников",
    "USE_VAD":                  "Использовать режим активации по голосу",
    "CHANGE_NICKNAME":          "Изменять никнейм",
    "MANAGE_NICKNAMES":         "Управлять никнеймами",
    "MANAGE_ROLES":             "Управлять ролями",
    "MANAGE_WEBHOOKS":          "Управлять вебхуками",
    "MANAGE_EMOJIS":            "Управлять эмодзи",
    "CONNECT":                  "Подключаться",
    "STREAM":                   "Стримить",
    "SPEAK":                    "Разговаривать",
}

/**
 * Преобразует элементы массива в красивую строку.
 * Префикс или постфикс может содержать I (номер).
 * @param {Array<String>} arrayClone
 * @param {String} prefix
 * @param {String} postfix
 * @returns {String}
*/
function stringifyArray(array, prefix, postfix) {
    // Хуйня вариант
    // let bufferArray = []; //  Этот процесс обязателен. Мы создаём буферную переменную, уже которую мы будем модифицировать.
    // array.forEach(elm => bufferArray.push(elm)); //  Без этого мы будем модифицировать напрямую array а это приведёт к ОЧЕНЬ пагубным последствиям
    const arrayClone = array.slice(); // Создаём клон массива, чтобы случайно не уебать основной
    
    if(arrayClone.length == 1) return `${prefix.replace('I', 1)}${arrayClone[0]}`;

    //  Присоединяем к каждому элементу спереди префикс и сзади постфикс, кроме последнего.
    // Хуйня вариант #2
    // for(let i = 0; i < array.length-1; i++) array[i] = `${prefix.replace('I', i+1)}${array[i]}${postfix.replace('I', i+1)}`;
    
    arrayClone.map((v, i) => `${prefix.replace('I', i+1)}${v}${postfix.replace('I', i+1)}`);

    //  Последнему элементу присоединяем только префикс
    arrayClone[arrayClone.length-1] = `${prefix.replace('I', arrayClone.length)}${array[arrayClone.length-1]}`;

    return arrayClone.join(); // Соединяем все элементы воедино
}

/**
 * Преобразует в строку на русском массив из прав.
 * @param {Array<String>} perms
 * @param {Boolean} newLines
 * @returns {String}
 */
function stringifyPermissions (perms, newLines = false) {
    // Хуйня вариант.
    // let result;
    // let bufferPerms = [];
    // for(let i = 0;i<perms.length;i++) {
    //     bufferPerms.push(permissions[perms[i]])
    //     //bufferPerms[i] = permissions[bufferPerms[i]];
    // }

    // result = stringifyArray(bufferPerms, "", newLines ? "\n" : ", ");

    // return result;
    
    return stringifyArray(perms.slice().map(v => permissions[v]), "", newLines ? "\n" : ", ");
}

/**
 * Производит поиск человека по серверу
 * @param {discord.Message} message
 * @param {String} string
 * @returns {Array<discord.GuildMember>} results
 */
function findMembers (message, string) {
    let results = [];
    
    if(message.guild.members.cache.get(string)) results.push(message.guild.members.cache.get(string));
    if( Array.from(message.mentions.members.values()).length != 0 ) results = results.concat( Array.from(message.mentions.members.values()) );
    if( Array.from(message.guild.members.cache.filter(m => m.user.username == string).values()).length != 0 ) results = results.concat( Array.from(message.guild.members.cache.filter(m => m.user.username == string).values()) );
    if( Array.from(message.guild.members.cache.filter(m => m.nickname == string).values()).length != 0 ) results = results.concat( Array.from(message.guild.members.cache.filter(m => m.nickname == string).values()) );
    if( Array.from(message.guild.members.cache.filter(m => m.user.tag == string).values()).length != 0 ) results = results.concat( Array.from(message.guild.members.cache.filter(m => m.user.tag == string).values()) );

    return Array.from(new Set(results)); //  Избавляемся от дубликатов
}

/**
 * Производит поиск человека по серверу
 * @param {discord.Message} message
 * @param {String} string
 * @returns {Array<discord.GuildChannel>} results
 */
 function findChannels (message, string) {
    let results = [];
    
    if(message.guild.channels.cache.get(string)) results.push(message.guild.channels.cache.get(string));
    if( Array.from(message.mentions.channels.values()).length != 0 ) results = results.concat( Array.from(message.mentions.channels.values()) );
    if( Array.from(message.guild.channels.cache.filter(m => m.name == string).values()).length != 0 ) results = results.concat( Array.from(message.guild.channels.cache.filter(m => m.name == string).values()) );

    return Array.from(new Set(results)); //  Избавляемся от дубликатов
}

/**
 * Производит поиск человека по серверу
 * @param {discord.Message} message
 * @param {String} string
 * @returns {Array<discord.Role>} results
 */
 function findRoles (message, string) {
    let results = [];
    
    if(message.guild.roles.cache.get(string)) results.push(message.guild.roles.cache.get(string));
    if( Array.from(message.mentions.roles.values()).length != 0 ) results = results.concat( Array.from(message.mentions.roles.values()) );
    if( Array.from(message.guild.roles.cache.filter(m => m.name == string).values()).length != 0 ) results = results.concat( Array.from(message.guild.roles.cache.filter(m => m.name == string).values()) );

    return Array.from(new Set(results)); //  Избавляемся от дубликатов
}

/**
 * Получаем ответ из URL сразу в виде json
 * Не забудь перед функцией прописать await
 * @param {String} URL
 * @returns {Promise}
*/
async function getJsonResponse(URL, ...options) {
    const response = await fetch(URL, ...options);

    return await response.json();
}

// PERFECT INTELLISENSE COMPATIBILITY
/**
 * Возвращает рандомный элемент итерируемого объекта.
 * @template T Тип данных элементов итерируемого объекта
 * @param {Iterable<T>} iterable
 * @returns {T}
 */
function randomChoice(iterable) {
    const array = Array.from(iterable);
    return array.length == 0 ? undefined : array[Math.round(-0.5 + Math.random() * (array.length))];
}

module.exports = {
    findMembers,
    findChannels,
    findRoles,
    stringifyPermissions,
    getJsonResponse,
    stringifyArray,
    randomChoice,
    permissions
}