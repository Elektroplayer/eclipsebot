// eslint-disable-next-line no-unused-vars
import { MessageEmbed, CommandInteraction } from 'discord.js'
import Command from '../structures/Command.js'
import Errors from '../structures/Errors.js'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class RollCommand extends Command {
    info = {
        description: 'Рандом чего-то там!',
        name: 'roll',
        options: [
            {
                name: 'number',
                description: 'Выберет случайную цифру от 0 до `num`',
                type: 'SUB_COMMAND',
                options: [{
                    name: 'num',
                    description: 'Напиши N',
                    type: 'NUMBER',
                    required: true,
                }]
            },{
                name: 'numbers',
                description: 'Выберет случайную цифру от `num1` до `num2`',
                type: 'SUB_COMMAND',
                options: [{
                    name: 'num1',
                    description: 'Напиши N',
                    type: 'NUMBER',
                    required: true,
                },{
                    name: 'num2',
                    description: 'Напиши M',
                    type: 'NUMBER',
                    required: true,
                }]
            },{
                name: 'words',
                description: 'Выберет рандомное слово из введённых',
                type: 'SUB_COMMAND',
                options: [{
                    name: 'words',
                    description: 'Слова или реплики разделяются запятой!',
                    type: 'STRING',
                    required: true,
                }]
            },{
                name: 'user',
                description: 'Выберет рандомного человека на сервере',
                type: 'SUB_COMMAND',
            },{
                name: 'color',
                description: 'Выберет Случайный цвет',
                type: 'SUB_COMMAND',
            },{
                name: '8ball',
                description: 'Шар предсказаний',
                type: 'SUB_COMMAND',
            }
        ]
    }

    help = {
        category: 'Общее',
        arguments: [
            '**number** `num` - Выберет случайную цифру от 0 до `num`.',
            '**numbers** `num1` `num2` - Выберет случайную цифру от `num1` до `num2`.',
            '**words** `words` - Выберет случайное слово из введённых. *Слова или реплики разделяются запятой!*',
            '**user** - Выберет случайного человека на сервере.',
            '**color** - Выберет случайный цвет.',
            '**8ball** - Шар предсказаний.',
        ],
        using: [
            '**/roll number** `num: 10` - Выберет случайную цифру от 0 до 10.',
            '**/roll numbers** `num1: 5` `num2: 10` - Выберет случайную цифру от 5 до 10.',
            '**/roll words** `words: Макароны, Лапша, Вермишель с молоком, Спиральки` -  Выберет случайное слово из введённых.'
        ],
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async exec(interaction) {
        switch (interaction.options._subcommand) {
            case 'number': {
                await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(`Случайная цифра от 0 до ${interaction.options._hoistedOptions[0].value}!`)
                        .setColor(this.client.config.colors.default)
                        .setDescription(`\`\`\`${getRandomInt(0,interaction.options._hoistedOptions[0].value)}\`\`\``)
                        .setFooter({text: this.client.footerMaker(interaction)})
                    ],
                    ephemeral: false
                })
                break
            }

            case 'numbers': {
                await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(`Случайная цифра от ${interaction.options._hoistedOptions[0].value} до ${interaction.options._hoistedOptions[1].value}!`)
                        .setColor(this.client.config.colors.default)
                        .setDescription(`\`\`\`${getRandomInt(interaction.options._hoistedOptions[0].value,interaction.options._hoistedOptions[1].value)}\`\`\``)
                        .setFooter({text: this.client.footerMaker(interaction)})
                    ],
                    ephemeral: false
                })
                break
            }

            case 'words': {
                let words = interaction.options._hoistedOptions[0].value.split(/,\s*/g).filter(elm => elm.trim()) // Возможно...

                if(!words[0]) return Errors.falseArgs(interaction,'Слова не указаны!')

                await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(`Слова: \`${words.join(', ').length > 246 ? words.join(', ').slice(0,243) + '...' : words.join(', ')}\``)
                        .setColor(this.client.config.colors.default)
                        .setDescription(`\`\`\`${words[ Math.floor( Math.random() * words.length ) ]}\`\`\``)
                        .setFooter({text: this.client.footerMaker(interaction)})
                    ],
                    ephemeral: false
                })
                break
            }

            case 'user': {
                await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Случайный человек')
                        .setColor(this.client.config.colors.default)
                        .setDescription(`\`\`\`${interaction.guild.members.cache.random().user.tag}\`\`\``)
                        .setFooter({text: this.client.footerMaker(interaction)})
                    ],
                    ephemeral: false
                })
                break
            }

            case 'color': {
                let color = '#'
                for (var i = 0; i < 6; i++) {
                    color += '0123456789ABCDEF'[Math.floor(Math.random() * 16)]
                }

                await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Случайный цвет')
                        .setColor(color)
                        .setDescription(`\`\`\`${color}\`\`\``)
                        .setFooter({text: this.client.footerMaker(interaction)})
                    ],
                    ephemeral: false
                })
                break
            }

            case '8ball': {
                let answers = [
                    { text: 'Бесспорно', color: '0000ff' },{ text: 'Предрешено', color: '0000ff' },{ text: 'Никаких сомнений', color: '0000ff' },{ text: 'Определённо да', color: '0000ff' },{ text: 'Можешь быть уверен в этом', color: '0000ff' },
                    { text: 'Мне кажется — «да»', color: '00ff00' },{ text: 'Вероятнее всего', color: '00ff00' },{ text: 'Хорошие перспективы', color: '00ff00' },{ text: 'Знаки говорят — «да»', color: '00ff00' },{ text: 'Да', color: '00ff00' },
                    { text: 'Пока не ясно, попробуй снова', color: 'FFA500' },{ text: 'Спроси позже', color: 'FFA500' },{ text: 'Лучше не рассказывать', color: 'FFA500' },{ text: 'Сейчас нельзя предсказать', color: 'FFA500' },{ text: 'Сконцентрируйся и спроси опять', color: 'FFA500' },
                    { text: 'Даже не думай', color: 'ff0000' },{ text: 'Мой ответ — «нет»', color: 'ff0000' },{ text: 'По моим данным — «нет»', color: 'ff0000' },{ text: 'Перспективы не очень хорошие', color: 'ff0000' },{ text: 'Весьма сомнительно', color: 'ff0000' },
                ]

                let rand = answers[Math.floor(Math.random()*20)]

                await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(rand.text)
                        .setColor(rand.color)
                        .setFooter({text: this.client.footerMaker(interaction)})
                    ],
                })
                break
            }
        }
    }
}