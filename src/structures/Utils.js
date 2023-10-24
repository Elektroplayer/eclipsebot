export const permissions = {
    'ADMINISTRATOR':            'Администратор',
    'CREATE_INSTANT_INVITE':    'Создавать приглашение',
    'KICK_MEMBERS':             'Выгонять участников',
    'BAN_MEMBERS':              'Банить участников',
    'MANAGE_CHANNELS':          'Управлять каналами',
    'MANAGE_GUILD':             'Управлять сервером',
    'ADD_REACTIONS':            'Добавлять реакции',
    'VIEW_AUDIT_LOG':           'Просматривать аудит',
    'PRIORITY_SPEAKER':         'Приоритетный режим',
    'VIEW_CHANNEL':             'Просматривать канал',
    'SEND_MESSAGES':            'Отправлять сообщения',
    'SEND_TTS_MESSAGES':        'Отправлять Text-To-Speech сообщения',
    'MANAGE_MESSAGES':          'Управлять сообщениями',
    'ATTACH_FILES':             'Отправлять файлы',
    'READ_MESSAGE_HISTORY':     'Просматривать историю сообщений',
    'MENTION_EVERYONE':         'Упоминание `@everyone`, `@here`',
    'USE_EXTERNAL_EMOJIS':      'Использовать внешние эмодзи',
    'VIEW_GUILD_INSIGHTS':      'Просматривать аналитику сервера',
    'MUTE_MEMBERS':             'Отключать участникам микрофон',
    'DEAFEN_MEMBERS':           'Отключать участникам звук',
    'MOVE_MEMBERS':             'Перемещать участников',
    'USE_VAD':                  'Использовать режим активации по голосу',
    'CHANGE_NICKNAME':          'Изменять никнейм',
    'MANAGE_NICKNAMES':         'Управлять никнеймами',
    'MANAGE_ROLES':             'Управлять ролями',
    'MANAGE_WEBHOOKS':          'Управлять вебхуками',
    'MANAGE_EMOJIS':            'Управлять эмодзи',
    'CONNECT':                  'Подключаться',
    'STREAM':                   'Стримить',
    'SPEAK':                    'Разговаривать',
}

/**
 * Преобразует элементы массива в красивую строку.
 * Префикс или постфикс может содержать I (номер).
 */
export function stringifyArray(array, prefix, postfix, noPostfixAtEnd = false) {
    let arrayClone = array.slice() // Создаём клон массива, чтобы случайно не уничтожить основной

    if(arrayClone.length == 1) return `${prefix.replace('I', '1')}${arrayClone[0]}`

    arrayClone = arrayClone.map((v, i) => `${prefix.replace('I', `${i+1}`)}${v}${noPostfixAtEnd ? '' : postfix.replace('I', `${i+1}`)}`)

    // Последнему элементу присоединяем только префикс
    arrayClone[arrayClone.length-1] = `${prefix.replace('I', `${arrayClone.length}`)}${array[arrayClone.length-1]}`

    return arrayClone.join('') // Соединяем все элементы воедино
}

/**
 * Преобразует в строку на русском массив из прав.
 */
export function stringifyPermissions (perms, prefix = '', postfix = ', ') {
    return stringifyArray(perms.map((v) => permissions[v] || ''), prefix, postfix, true)
}

export function parseMS (milliseconds) {
    let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil
    return {
        days: roundTowardsZero(milliseconds / 86400000),
        hours: roundTowardsZero(milliseconds / 3600000) % 24,
        minutes: roundTowardsZero(milliseconds / 60000) % 60,
        seconds: roundTowardsZero(milliseconds / 1000) % 60,
        milliseconds: roundTowardsZero(milliseconds) % 1000
    }
}

/**
 * 
 * @param {Interaction} interaction 
 * @param {string} text 
 * @param {{
 *  member?: GuildMember,
 *  role?: Role,
 *  channel?: import('discord.js').TextBasedChannels,
 *  voice?: VoiceState,
 * }} params
 * @returns 
 */
export function formatText(params, text, interaction) {
    const member = params.member || interaction.member
    text = text.replaceAll(/{user.username}/gi, member.user.username)
               .replaceAll(/{user.display(_)?name}/gi, member.displayName)
               .replaceAll(/{user.display(_)?color}/gi, member.displayHexColor)
               .replaceAll(/`{user.permissions}`/gi, stringifyPermissions(member.permissions, '`', '`, `') + '`')
               .replaceAll(/\*\*{user.permissions}\*\*/gi, stringifyPermissions(member.permissions, '**', '**, **') + '||')
               .replaceAll(/\*{user.permissions}\*/gi, stringifyPermissions(member.permissions, '*', '*, *') + '`')
               .replaceAll(/\|\|{user.permissions}\|\|/gi, stringifyPermissions(member.permissions, '||', '||, ||') + '||')
               .replaceAll(/{user.permissions}/gi, stringifyPermissions(member.permissions))
               .replaceAll(/{user.tag}/gi, member.user.tag)
               .replaceAll(/{user.mention}/gi, member.toString())
    
    if (params.role)
        text = text.replaceAll(/{role.name}/gi, params.role.name)
                   .replaceAll(/{role.mention}/gi, params.role.toString())
                   .replaceAll(/{role.color}/gi, params.role.hexColor)
                   .replaceAll(/`{role.permissions}`/gi, stringifyPermissions(params.role.permissions, '`', '`, `') + '`')
                   .replaceAll(/\*\*{role.permissions}\*\*/gi, stringifyPermissions(params.role.permissions, '**', '**, **') + '||')
                   .replaceAll(/\*{role.permissions}\*/gi, stringifyPermissions(params.role.permissions, '*', '*, *') + '`')
                   .replaceAll(/\|\|{role.permissions}\|\|/gi, stringifyPermissions(params.role.permissions, '||', '||, ||') + '||')
                   .replaceAll(/{role.permissions}/gi, stringifyPermissions(params.role.permissions))
    
                   const channel = params.channel || interaction.channel
    text = text.replaceAll(/{channel.name}/gi, channel.name)
               .replaceAll(/{channel.mention}/gi, channel.toString())
    /**
     * @type {VoiceState}
     */
    const voice = params.voice || member.voice
    text = text.replaceAll(/{voice.name}/gi, voice.channel.name)
               .replaceAll(/{voice.mention}/gi, voice.channel.mention)
               .replaceAll(/{voice.members}/gi, stringifyArray(voice.channel.members.map(member => member.displayName), '', ', ', true))
               .replaceAll(/{voice.members.tags}/gi, stringifyArray(voice.channel.members.map(member => member.user.tag), '', ', ', true))
               .replaceAll(/{voice.members.mentions}/gi, stringifyArray(voice.channel.members.map(member => member.toString()), '', ', ', true))
               .replaceAll(/{voice.members.color}/gi, stringifyArray(voice.channel.members.map(member => member.displayHexColor), '', ', ', true))
    
    return text
}

export class dynamicTimer {
    callback
    triggerTime
    timer

    constructor(func, delay) {
        this.callback = func
        this.triggerTime = +new Date + delay
        this.timer = 0
        this.updateTimer()
    }

    updateTimer() {
        clearTimeout(this.timer)
        let delay = this.triggerTime - new Date
        this.timer = setTimeout(this.callback, delay)
        return this
    }

    addTime(delay) {
        this.triggerTime += delay
        this.updateTimer()
        return this
    }

    getTime() {
        return this.triggerTime - new Date
    }
}

export const ru_RUmod = {
    days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    shortDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    shortMonths: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    AM: 'AM',
    PM: 'PM',
    am: 'am',
    pm: 'pm',
    formats: {
        c: '%a %d %b %Y %X',
        D: '%d.%m.%y',
        F: '%Y-%m-%d',
        R: '%H:%M',
        r: '%I:%M:%S %p',
        T: '%H:%M:%S',
        v: '%e-%b-%Y',
        X: '%T',
        x: '%D'
    }
}

export function format(string, args, start = '{{', end = '}}') {
    for (let key in args) {
        let val = args[key]
        string = string.replace(new RegExp(`\\${start}${key}\\${end}`, 'g'), val)
    }
    return string
}


/**
 * Математическая функция, которая вычисляет, сколько нужно опыта для определённого уровня
 * @param {number} x
 * @returns {number}
 */
export function levelFunc(x) {
    return 300 + Math.floor(300 * x * Math.pow(1.06, x) )
}


/**
 * Подсчёт уровня по количеству xp
 * @param {number} xp
 * @returns {number}
 */
export function getLevel (xp) {
    if (xp< 0) return -1
    let level = 0
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (xp - levelFunc(level) >= 0) {
            xp -= levelFunc(level)
            level++
        } else break
    }
    return level
}

export function formatObject(object, format) {
    if (typeof object == 'string') return format(object)

    else if (Array.isArray(object)) return object.map(elm => {
        return formatObject(elm, format)
    })

    else if (typeof object == 'object') {
        for(let key in object) object[key] = formatObject(object[key], format)

        return object
    }

    else {
        return object
    }
}

export default {
    format,
    stringifyPermissions,
    stringifyArray,
    permissions,
    parseMS,
    dynamicTimer,
    ru_RUmod,
    levelFunc,
    getLevel,
    formatObject
}
