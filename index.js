const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6021001026:AAFj2aZYRYzP8q8ngUstfg3d7FzreGJJcGI'
const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9, а ты угадай :)')

    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await  bot.sendMessage(chatId, 'Угадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсвие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/eb7/80f/eb780f5f-99e7-4005-8c35-898b61b096cd/96/11.webp')
            return  bot.sendMessage(chatId, "Приветсвую тебя мой дорогой друг!")
        }

        if (text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя к сожалению не понимаю')

    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
            return startGame(chatId)
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `${chats[chatId]}Поздравляю!!! ${data} - это та самая цифра которая была загадана!!!`, againOptions)
        } else {
            return bot.sendMessage(chatId, `${chats[chatId]}Опс!!! ${data} - это не та цифра которая была загадана!!! Ппопробуй еще - вдруг повезет!!!`, againOptions)

        }

    })
}

start()