import { createEvent } from "./crud.js";
import { dentalProcedures, escapeMarkdown } from "./keyboards.js";
import { fromZonedTime, format } from 'date-fns-tz'


const generateUniversalCalendarLink = (googleEventLink) => {
    // Парсимо деталі з Google Calendar посилання
    const url = new URL(googleEventLink);
    const eid = url.searchParams.get('eid');

    // iCloud додавання події
    const icloudLink = `webcal://p49-caldav.icloud.com/published/2/MTI3NjM5NTc1MTI3NjM5NTdfMTI3NjM5NTc1/${eid}`;

    return {
        googleCalendarLink: googleEventLink,
        icloudLink
    };
};

const castomEvent = async (phone, procedureIndex, selectedDate, selectedTime) => {
    try {
        const procedure = dentalProcedures[procedureIndex];
        if (!procedure) {
            throw new Error('Невірний індекс процедури');
        }

        // Отримання тривалості процедури в хвилинах
        const durationMinutes = parseInt(procedure.duration);
        if (isNaN(durationMinutes)) {
            throw new Error('Некоректна тривалість процедури');
        }

        // Форматування початкового часу
        const kyivTime = `${selectedDate}T${selectedTime}:00`; // Локальний час
        const startDateTime = fromZonedTime(kyivTime, 'Europe/Kyiv'); // UTC
        const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000); // UTC

        console.log('Start DateTime (UTC):', startDateTime);
        console.log('End DateTime (UTC):', endDateTime);

        const event = { 
            summary: procedure.name, 
            description: `Телефон клієнта: ${phone}\nЦей запис створено клієнтом самостійно через бота.`, 
            start: { 
                dateTime: startDateTime.toISOString(), 
                timeZone: 'Europe/Kyiv', 
            }, 
            end: { 
                dateTime: endDateTime.toISOString(), 
                timeZone: 'Europe/Kyiv', 
            }, 
            extendedProperties: { 
                private: { 
                    phone: phone,
                    email: 'brysommer1@gmail.com'
                }, 
            },
            
        };

        const response = await createEvent(event);

        const calendarLinks = generateUniversalCalendarLink(response.htmlLink);

        console.log(calendarLinks)

        return `✅ *Запис успішно створено\\!* 🎉

📅 [Додати подію до свого календаря](${escapeMarkdown(response.htmlLink)})
`;
    } catch (error) {
        console.error('Помилка при створенні події:', error.message);
        return 'Помилка при створенні події';
    }
};


export default castomEvent;
