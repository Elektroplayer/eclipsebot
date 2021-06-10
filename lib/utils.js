// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const fetch       = require('node-fetch');

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
 * @param { [String] } array
 * @param {String} prefix
 * @param {String} postfix
 * @returns {String}
*/
function stringifyArray (array, prefix, postfix) {
    if(array.length == 1) return prefix.replace('I', 1) + array[0];

    //  Присоединяем к каждому элементу спереди префикс и сзади постфикс, кроме последнего.
    for(let i = 0;i<array.length-1;i++) array[i] = prefix.replace('I', i+1) + array[i] + postfix.replace('I', i+1);
    //  Последнему элементу присоединяем только префикс
    array[array.length-1] = prefix.replace('I', array.length) + array[array.length-1];

    return array.join(''); // Соединяем все элементы воедино
}

/**
 * Преобразует в строку на русском массив из прав.
 * @param { [String] } perms
 * @param {Boolean} newLines
 * @returns {String}
 */
function stringifyPermissions (perms, newLines = false) {
    for(let i = 0;i<perms.length;i++) {
        perms[i] = permissions[perms[i]];
    }

    return stringifyArray(perms, "", newLines ? "\n" : ", ");
}

/**
 * Производит поиск человека по серверу
 * @param {discord.Message} message
 * @param {String} string
 * @returns {Array} results
 */
function findMembers (message, string) {
    let results = []
    
    if(message.guild.members.cache.get(string)) results.push(message.guild.members.cache.get(string));
    if( Array.from(message.mentions.members.values()).length != 0 ) results = results.concat( Array.from(message.mentions.members.values()) );
    if( Array.from(message.guild.members.cache.filter(m => m.user.username == string).values()).length != 0 ) results = results.concat( Array.from(message.guild.members.cache.filter(m => m.user.username == string).values()) );
    if( Array.from(message.guild.members.cache.filter(m => m.nickname == string).values()).length != 0 ) results = results.concat( Array.from(message.guild.members.cache.filter(m => m.nickname == string).values()) );

    return Array.from(new Set(results)); //  На всякий случай избавляемся от дубликатов
}

/**
 * Получаем ответ из URL сразу в виде json
 * Не забудь перед функцией прописать await
 * @param {String} URL
 * @returns {Promise}
*/
async function getJsonResponse (URL) {
    let response = await fetch(URL);

    return await response.json()
}

module.exports = {
    findMembers,
    stringifyPermissions,
    getJsonResponse,
    stringifyArray,
    permissions
}