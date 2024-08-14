import { CommandInteraction } from "discord.js";

type ValueType = string | boolean | undefined;

export function sendValue(intr: CommandInteraction, value: ValueType) {
    return intr.reply({content: `Значение: \`${value}\``});
}

export function successfully(intr: CommandInteraction, value: ValueType) {
    return intr.reply({content: `Значение установлено на \`${value}\``})
}

export function invalidValue(intr: CommandInteraction, reason?: string) {
    return intr.reply({content: `Недопустимое значение!\n${reason ? `\`${reason}\`` : ''}`});
}

export function unknownKey(intr: CommandInteraction) {
    return intr.reply({content: `Неизвестный ключ!`});
}

export function keyReadOnly(intr: CommandInteraction) {
    return intr.reply({content: `Этот ключ только для чтения!`});
}

export default { sendValue, successfully, invalidValue, unknownKey, keyReadOnly }