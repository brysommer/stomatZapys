import TelegramBot from 'node-telegram-bot-api';
import data from './values.js';
import { dentalProcedures, escapeMarkdown, generateMainMenu, generateProcedureKeyboard } from './keyboards.js';
import appointment from './appointment.js';

const bot = new TelegramBot(data.token, { polling: true });

appointment();

bot.setMyCommands([
    { command: '/start', description: 'Почати спочатку' },
  ]);

bot.onText(/\/start/, async (msg) => {

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, '👋 Вітаємо! Оберіть один із пунктів меню:', {
        reply_markup: generateMainMenu()
    });

});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    switch (msg.text) {
        case '📝 Запис на прийом':
            bot.sendMessage(chatId, '🦷 *Оберіть лікаря:*', {
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [
                        [{ text: 'Терапевт' }],
                        [{ text: 'Ортодонт' }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                }
            });
            break;
        case 'Терапевт':
            bot.sendMessage(chatId, '🦷 *Оберіть процедуру:*', {
                parse_mode: 'Markdown',
                reply_markup: generateProcedureKeyboard(dentalProcedures, 'Терапевт'),
            });              
            break;
        case 'Ортодонт':
                bot.sendMessage(chatId, '🦷 *Оберіть процедуру:*', {
                    parse_mode: 'Markdown',
                    reply_markup: generateProcedureKeyboard(dentalProcedures, 'Ортодонт'),
                });              
                break;
        case '💰 Прайс':
            bot.sendMessage(chatId, '💰 Прайс-лист');
            bot.sendMessage(chatId, `📋 [Переглянути повний прайс\\-лист](${escapeMarkdown('https://docs.google.com/spreadsheets/d/1hGshc6J9SEEANoRjPzDvkaL-7pAlXufrLemNk_rdAuY/edit?usp=sharing')})`, {
                parse_mode: 'MarkdownV2'
            });
            break;
        case '📍 Як нас знайти':
            bot.sendMessage(chatId, 'Ми знаходимося за адресою: 📍 Київ, вул. Гарна, 1.');
            bot.sendVideo(chatId, 'BAACAgQAAxkBAANxZ5DWlgIgcVnf64dr01zB2lzSBKoAAjEDAAK29DRQQ_YPteTGnjk2BA');
            break;
        case '✉️ Написати нам':
            bot.sendMessage(chatId, 'Надішліть нам повідомлення, і ми швидко відповімо!');
            // Додайте логіку для зв’язку
            break;
    }
});


bot.on('video', (msg) => {
    const chatId = msg.chat.id;
    const video = msg.video;

    if (video) {
        const videoId = video.file_id;

        bot.sendMessage(chatId, `Ваше відео отримано. Ось його ID: ${videoId}`);
    } else {
        bot.sendMessage(chatId, 'Не вдалося отримати ID відео.');
    }
});


export { bot };