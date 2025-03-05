import { addDays, format } from 'date-fns';

const dentalProcedures = [
    { name: 'Чистка зубів', duration: '30 хв', doctor: 'Терапевт' },
    { name: 'Лікування карієсу', duration: '60 хв', doctor: 'Терапевт' },
    { name: 'Відбілювання', duration: '45 хв', doctor: 'Терапевт' },
    { name: 'Видалення зуба', duration: '50 хв', doctor: 'Терапевт' },
    { name: 'Протезування', duration: '90 хв', doctor: 'Ортодонт' },
    { name: 'Професійна гігієна', duration: '40 хв', doctor: 'Терапевт' },
    { name: 'Консультація ортодонта', duration: '30 хв', doctor: 'Ортодонт' },
    { name: 'Консультація терапевта', duration: '30 хв', doctor: 'Терапевт' },
    { name: 'Лікування кореневих каналів', duration: '120 хв', doctor: 'Терапевт' },
    { name: 'Відбілювання зубів', duration: '60 хв', doctor: 'Терапевт' },
];

const generateProcedureKeyboard = (procedures, doctor) => {
    
    const keyboard = [];
    const buttonsPerRow = 2;

    // Фільтруємо процедури за лікарем
    const filteredProcedures = procedures
        .map((procedure, index) => ({ ...procedure, originalIndex: index })) // Додаємо оригінальний індекс до кожної процедури
        .filter(procedure => procedure.doctor === doctor); // Фільтруємо за лікарем

    filteredProcedures.forEach((procedure) => {
        const button = {
            text: `${procedure.name} (${procedure.duration})`,
            callback_data: `procedure_${procedure.originalIndex}` // Використовуємо оригінальний індекс
        };

        // Додаємо кнопку в новий рядок клавіатури, якщо кількість кнопок у рядку перевищує 2
        if (!keyboard[keyboard.length - 1] || keyboard[keyboard.length - 1].length === buttonsPerRow) {
            keyboard.push([]);
        }
        keyboard[keyboard.length - 1].push(button);
    });

    return {
        inline_keyboard: keyboard
    };
};

const generateCalendarKeyboard = (startDate, procedureIndex, days = 14) => {
    const keyboard = [];
    const buttonsPerRow = 5;

    for (let i = 0, addedDays = 0; addedDays < days; i++) {
        const date = addDays(startDate, i);
        const formattedDate = format(date, 'yyyy-MM-dd');
        const dayOfWeek = date.getDay(); // 0 - неділя, 6 - субота

        // Пропускаємо суботу (6) та неділю (0)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            continue;
        }

        const button = {
            text: format(date, 'dd/MM'),
            callback_data: `date_${procedureIndex}_${formattedDate}`
        };

        if (!keyboard[keyboard.length - 1] || keyboard[keyboard.length - 1].length === buttonsPerRow) {
            keyboard.push([]);
        }
        keyboard[keyboard.length - 1].push(button);

        addedDays++; // Лічильник реальних робочих днів
    }

    return {
        inline_keyboard: keyboard
    };
};


const generateMainMenu = () => {
    return {
        keyboard: [
            [
                { text: '📝 Запис на прийом' },
                { text: '📍 Як нас знайти' }
            ],
            [
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
