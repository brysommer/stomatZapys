import { google } from 'googleapis';
import fs from 'fs';

// Завантаження облікових даних сервісного акаунта
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

// Налаштування JWT клієнта з делегуванням
const auth = new google.auth.JWT(
    credentials.client_email, // Email сервісного акаунта
    null,
    credentials.private_key,  // Приватний ключ
    ['https://www.googleapis.com/auth/calendar'], // Права доступу
    'stomatologiya@stomatologiya-calendar.iam.gserviceaccount.com' // Email користувача, від імені якого виконуються дії
);

// Ініціалізація Calendar API
const calendar = google.calendar({ version: 'v3', auth });


export default calendar;
