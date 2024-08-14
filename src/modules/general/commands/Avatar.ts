import {
    ApplicationCommandType,
    CommandInteraction,
    ContextMenuCommandBuilder,
    SlashCommandBuilder,
    UserContextMenuCommandInteraction,
} from 'discord.js';
import Command, { CommandTypes } from '../../../structures/Command.js';

type req = 'png' | 'webp' | 'gif' | 'jpg' | 'jpeg';

export default class PingCommand extends Command {
    slashOptions = new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Показать аватар')
        .addUserOption((opt) => opt.setName('user').setDescription('Указать пользователя'))
        .addStringOption((opt) =>
            opt
                .setName('extention')
                .setDescription('Указать требуемое расширение (webp по умолчанию)')
                .addChoices([
                    { name: 'png', value: 'png' },
                    { name: 'webp', value: 'webp' },
                    { name: 'gif', value: 'gif' },
                    { name: 'jpg', value: 'jpg' },
                    { name: 'jpeg', value: 'jpeg' },
                ]),
        );

    contextOptions = new ContextMenuCommandBuilder().setName('Аватар').setType(ApplicationCommandType.User);

    async exec(intr: CommandInteraction | UserContextMenuCommandInteraction) {
        let user = intr.options.get('user')?.user ?? intr.user;
        let extension = `${intr.options.get('extention')?.value ?? 'webp'}` as req;
        let url = user.avatarURL({ size: 4096, extension });

        if (!url)
            intr.reply({
                content: `У пользователя нет аватара`,
                ephemeral: true,
            });
        else
            intr.reply({
                content: `Аватар: [Ссылка](${url})`,
                ephemeral: true,
            });
    }
}
