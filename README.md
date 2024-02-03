![Banner](https://cdn.discordapp.com/attachments/770009593131827300/887699952896200754/banner.png)
<p align="center">

<a href="https://discord.gg/PHuvYMrvdr"><img src="https://img.shields.io/discord/769184583123730432?color=7289da&logo=discord&logoColor=white"></a>
<img src="https://img.shields.io/badge/made%20by-NightDevs-blue.svg" >
<img src="https://img.shields.io/github/stars/Elektroplayer/eclipsebot.svg?style=flat">
<img src="https://img.shields.io/github/languages/top/Elektroplayer/eclipsebot.svg">
</p>

# EclipseBot
Eclipse это самодостаточный Discord бот с открытым исходным кодом, простой в использовании и написанный на JavaScript.

### Дисклеймер (Если самостоятельное размещение)
Вам не разрешено загружать этого бота на какой-либо сервис как discordbotlist или top.gg, вам только разрешено использовать его только для ваших серверов!


### Примите участие в развитии Eclipse!
- [Сделайте форк репозитория](https://github.com/Lokilife/Eclipse/fork)!
- Клонируйте ваш форк: `git clone https://github.com/your-username/Eclipse.git`
- Создайте свою ветвь функций: `git checkout -b my-new-feature`
- Примените ваши изменения: `git commit -am 'Add some feature'`
- Отправьте в репозиторий: `git push origin my-new-feature`
- Сделайте pull request

**Пожалуйста рассказывайте мне об ошибках или методах оптимизации!**

### MiniWiki

Инструкция по запуску бота:
1. Установите [Node.JS](https://nodejs.org/ru/).
2. Установите зависимости: `npm install`.
3. Установите .env конфигурацию в корне:
```dotenv
TOKEN=YOUR_TOKEN
MONGOTOKEN=YOUR_MONGO_URI
```
4. Создайте `./config.js`
```js
export default {
    "owners": ["ВАШ_ID", "ДРУГИЕ_ID"],
    "colors": {
        "default": "7762d2",
        "errorRed": "cc0000",
        "warnOrange": "fdb21a",
        "successGreen": "00ce00"
    },
    "main": {
        "channel": "ID_ГЛАВНОГО_КАНАЛА",
        "guild": "ID_ГЛАВНОГО_СЕРВЕРА"
    },
    "mode": "normal/debug"
}
```
*mode отвечает за глобальное или локальное включение команд*

5. Запустите: `npm start`

### Участники проекта (указаны ники в Discord):
**EclipseBot** © Night Devs<br>

`[ElectroPlayer]#0256` - Разработчик бота, владелец проекта<br>
`Lokilife#3331` - Разработчик бота<br>
`Lookins#4727` - Тестировщик, баг хантер<br>

### Благодарности
`AutoPlayer#2083` - Дал хост на первое время<br>

### Донатеры
`KrisTalium#7339` - 261 рубль<br>
`san#6816` - 100 рублей<br>
`Xaliks#5501` - 70 рублей<br>
`Рита#0676` - 60 рублей<br>
`Tegnio#6546` - 10 рублей<br>
`Lookins#6803` - 10 рублей<br>
`wylite#2873` - 6 рублей<br>
`Lokilife#3331` - 3,58 рубля<br>

### Полезные ссылки
Лицензия: [BSD 3-Clause](./LICENSE)<br>
Сервер Discord с ботом: [Ссылка](https://discord.gg/PHuvYMrvdr)<br>
Поддержать: [DonationAlerts](https://www.donationalerts.com/r/electroplayer)