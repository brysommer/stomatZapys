import { addDays, format } from 'date-fns';

const dentalProcedures = [
    { name: 'Чистка зубів', duration: '30 хв' },
    { name: 'Лікування карієсу', duration: '60 хв' },
    { name: 'Відбілювання', duration: '45 хв' },    
    { name: 'Консультація', duration: '15 хв' },
    { name: 'Видалення зуба', duration: '50 хв' },
    { name: 'Протезування', duration: '90 хв' },
];

const generateProcedureKeyboard = (procedures) => {
    const keyboard = [];
    const buttonsPerRow = 2;

    procedures.forEach((procedure, index) => {
        const button = {
            text: `${procedure.name} (${procedure.duration})`,
            callback_data: `procedure_${index}`
        };

        if (!keyboard[keyboard.length - 1] || keyboard[keyboard.length - 1].length === buttonsPerRow) {
            keyboard.push([]);
        }
        keyboard[keyboard.length - 1].push(button);
    });

    return {
        inline_keyboard: keyboard
    };
}

const generateCalendarKeyboard = (startDate, procedureIndex, days = 14) => {
    const keyboard = [];
    const buttonsPerRow = 7;

    for (let i = 0; i < days; i++) {

        const date = addDays(startDate, i);
        const formattedDate = format(date, 'yyyy-MM-dd');

        const button = {
            text: format(date, 'dd/MM'),
            callback_data: `date_${procedureIndex}_${formattedDate}`
        };

        if (!keyboard[keyboard.length - 1] || keyboard[keyboard.length - 1].length === buttonsPerRow) {
            keyboard.push([]);
        }
        keyboard[keyboard.length - 1].push(button);

    }

    return {
        inline_keyboard: keyboard
    };
}

const generateMainMenu = () => {
    return {
        keyboard: [
            [
                { text: '📝 Запис на прийом' },
                { text: '💰 Прайс' }
            ],
            [
                { text: '📍 Як нас знайти' },
                { text: '✉️ Написати нам' }
            ]
        ],
        resize_keyboard: true, // Зменшення кнопок для зручності
        one_time_keyboard: false // Клавіатура залишатиметься видимою
    };
}

const escapeMarkdown = (text) => {
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

export {
    generateProcedureKeyboard,
    generateCalendarKeyboard,
    dentalProcedures,
    generateMainMenu,
    escapeMarkdown
}
