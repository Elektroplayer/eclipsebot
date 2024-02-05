import { ChannelType, CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import Command from "../structures/Command.js";
import PrivateVoicesModel from "../models/PrivateVoicesModel.js";
import MessagesModel from "../models/MessagesModel.js";

type ValueType = string | boolean | undefined;

function sendValue(intr: CommandInteraction, value: ValueType) {
    return intr.reply({content: `Значение: \`${value}\``});
}

function successfully(intr: CommandInteraction, value: ValueType) {
    return intr.reply({content: `Значение установлено на \`${value}\``})
}

function invalidValue(intr: CommandInteraction) {
    return intr.reply({content: `Недопустимое значение!`});
}

// function warnNotPermissions(intr: CommandInteraction, perms: Array<PermissionsBitField>) {

// }

export default class PingCommand extends Command {
    options = new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Настройки')
    .addStringOption(opt => opt.setName('key').setDescription('Имя переменной').setRequired(true))
    .addStringOption(opt => opt.setName('value').setDescription('Новое значение'));

    actions:{[key:string]: (intr: CommandInteraction, value:string | undefined) => any} = {
        async 'welcome.enabled'(intr: CommandInteraction, value:string | undefined = undefined) {
            let settings = await MessagesModel.findOne({guildID: intr.guild?.id}).exec();

            if(!value) return sendValue(intr, settings?.enabled ?? 'Не назначено'); // intr.reply({content: `Значение: \`${settings?.enabled ?? 'Не назначено'}\``});
            else {
                if(['true', 'false'].includes(value.toLowerCase())) {
                    MessagesModel.findOneAndUpdate({guildID: intr.guild?.id}, {enabled: value.toLowerCase() == `true`}, { upsert: true });

                    return successfully(intr, value);
                } else return invalidValue(intr);
            }
        },

        async 'welcome.channelID'(intr: CommandInteraction, value:string | undefined = undefined) {
            let settings = await MessagesModel.findOne({guildID: intr.guild?.id}).exec();

            if(!value) return sendValue(intr, settings?.channelID ?? 'Не назначено');
            else {
                let channel = intr.guild?.channels.cache.get(value);

                if(!channel || channel.type !== ChannelType.GuildText) return invalidValue(intr);

                MessagesModel.findOneAndUpdate({guildID: intr.guild?.id}, {channelID: value}, { upsert: true });
            }
        }
    }

    async exec(intr: CommandInteraction) {
        let key = `${intr.options.get('key')?.value}`.toLowerCase();
        let value:string | undefined = `${intr.options.get('value')?.value}`;

        if(value == "undefined") value = undefined;

        console.log(key, value);

        let func = this.actions[key]

        if(!func) return intr.reply('Неверный ключ');
        else func(intr, value);
    }
}