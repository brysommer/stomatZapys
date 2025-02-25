import { bot } from './bot.js';
import castomEvent from './createEvent.js';
import { readEvents } from './crud.js';
import getFutureEventsRange from './dateRange.js';
import generateTimeKeyboard from './generateTimeKeyboard.js';
import { dentalProcedures, generateCalendarKeyboard, generateMainMenu } from './keyboards.js';
import valuesData from './values.js';

const userStates = new Map(); // Використовуємо Map для збереження станів користувачів

// Функція для запиту номера телефону
const requestPhoneNumber = (chatId, procedureIndex, selectedDate, selectedTime) => {
    bot.sendMessage(chatId, `📋 Деталі запису:

        🦷 Процедура: ${dentalProcedures[procedureIndex].name} (${dentalProcedures[procedureIndex].duration})
        📅 Дата: ${selectedDate}
        🕒 Час: ${selectedTime}
        
📱 Натисніть "Надати номер телефону" для продовження`, {
            reply_markup: {
                keyboard: [
                    [{
                        text: '📱 Надати номер телефону',
                        request_contact: true
                    }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
};

const appointment = () => {

    bot.on('callback_query', async (query) => {

        const chatId = query.message.chat.id;

        const { id, data, message } = query;    
   
        if (data.startsWith('procedure_')) {
            
            const procedureIndex = parseInt(data.split('_')[1], 10);
            const procedure = dentalProcedures[procedureIndex];
    
            const today = new Date();
            bot.sendMessage(chatId, `📅 *Оберіть дату для процедури:* _${procedure.name}_`, {
                parse_mode: 'Markdown',
                reply_markup: generateCalendarKeyboard(today, procedureIndex, 14),
            });              
            bot.answerCallbackQuery(query.id);
    
        } else if (data.startsWith('date_')) {
    
            const [_, procedureIndex, selectedDate] = data.split('_');

            const date = selectedDate.split('-');

            const range = getFutureEventsRange(date[0], date[1], date[2]);

            const selectedProcedure = dentalProcedures[procedureIndex];
            const doctor = selectedProcedure.doctor;

            let todayEvents;


            if (doctor === 'Терапевт') {

                todayEvents = await readEvents(range.startDate, range.endDate, valuesData.therapistCalendarId);

            } else if (doctor === 'Ортодонт') {

                todayEvents = await readEvents(range.startDate, range.endDate, valuesData.ortodontCalendarId);

            }
            
            console.log(todayEvents)

            bot.sendMessage(chatId, `⏰ *Оберіть час для дати:* _${selectedDate}_`, {
                parse_mode: 'Markdown',
                reply_markup: generateTimeKeyboard(procedureIndex, selectedDate, todayEvents),
            });              

            bot.answerCallbackQuery(query.id);
    
        } else if (data.startsWith('time')) {

            const [_, procedureIndex, selectedDate, selectedTime] = data.split('_');
    
            // Зберігаємо стан користувача
            userStates.set(chatId, {
                procedureIndex,
                selectedDate,
                selectedTime
            });
    
            // Запитуємо номер телефону
            requestPhoneNumber(chatId, procedureIndex, selectedDate, selectedTime);
    
            // Відповідаємо на callback-запит
            bot.answerCallbackQuery(id, { text: 'Оберіть номер телефону', show_alert: false });
        }
            
    });

    bot.on('contact', async (msg) => {
        const chatId = msg.chat.id;
        const contact = msg.contact;
    
        if (contact && userStates.has(chatId)) {
            const userData = userStates.get(chatId);
    
            // Ланцюжок інформації зберігається тут
            const { procedureIndex, selectedDate, selectedTime } = userData;

            const resultMessage = await castomEvent(contact.phone_number, procedureIndex, selectedDate, selectedTime);

            bot.sendMessage(chatId, resultMessage, {
                parse_mode: 'MarkdownV2',
                reply_markup: generateMainMenu()
            });

            const procedure = dentalProcedures[procedureIndex]

            bot.sendMessage(valuesData.logsID, `${contact.first_name} записався на ${procedure.name} ${procedure.duration} ${procedure.doctor}. Час запису ${selectedDate} ${selectedTime}`)
    
            // Видаляємо стан користувача після обробки
            userStates.delete(chatId);
        } else {
            bot.sendMessage(chatId, 'Не вдалося обробити ваш номер телефону. Спробуйте ще раз спочатку.', {
                reply_markup: generateMainMenu()
            });
        }
    });

};

export default appointment;

