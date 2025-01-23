import calendar from "./google.js";


const createEvent = async (event) => {
    try {
        console.log(event)
        const response = await calendar.events.insert({
            calendarId: 'ef2f3a378bdc0e678843df69c37da6c4be7156372395182c787b291df35c0a5a@group.calendar.google.com',
            resource: event,
        });

        return response.data;
    } catch (error) {
        console.error('Посилка стволрення події:', error.message);
        return null;
    }
};

const readEvents = async (startDate, endDate) => {
    try {
        const response = await calendar.events.list({
            calendarId: 'ef2f3a378bdc0e678843df69c37da6c4be7156372395182c787b291df35c0a5a@group.calendar.google.com',
            timeMin: startDate,
            timeMax: endDate,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const formatEvents = (events) => {
            return events.map(event => ({
                start: event.start.dateTime,
                end: event.end.dateTime
            }));
        };

        return formatEvents(response.data.items) || [];
    } catch (error) {
        console.error('Помилка читання подій:', error.message);
        return [];
    }
};

export { createEvent, readEvents };
