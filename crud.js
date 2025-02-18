import calendar from "./google.js";


const createEvent = async (event, calendarId) => {
    try {
        console.log(event)
        const response = await calendar.events.insert({
            calendarId,
            resource: event,
        });

        return response.data;
    } catch (error) {
        console.error('Посилка стволрення події:', error.message);
        return null;
    }
};

const readEvents = async (startDate, endDate, calendarId) => {
    try {
        const response = await calendar.events.list({
            calendarId,
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
