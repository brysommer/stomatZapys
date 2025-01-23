import { parseISO, isWithinInterval, addMinutes, addHours, isAfter } from 'date-fns'
import { dentalProcedures } from './keyboards.js';


const generateTimeKeyboard = (procedureIndex, selectedDate, todayEvents) => {
    const procedure = dentalProcedures[procedureIndex];
    const procedureDuration = parseInt(procedure.duration);
    const now = new Date();
    
    const timeToMinutes = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const isTimeSlotAvailable = (start, end, existingEvents, startMinutes) => {
        // Якщо сьогоднішня дата - перевіряємо чи слот не в минулому
        const isCurrentDay = new Date(selectedDate).toDateString() === now.toDateString();
        if (isCurrentDay) {
            const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
            if (startMinutes < currentTimeMinutes) return false;
        }

        return !existingEvents.some(event => {
            const eventStart = new Date(event.start).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
            const eventEnd = new Date(event.end).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
            
            const eventStartMinutes = timeToMinutes(eventStart);
            const eventEndMinutes = timeToMinutes(eventEnd);
            
            return (start >= eventStartMinutes && start < eventEndMinutes) ||
                   (end > eventStartMinutes && end <= eventEndMinutes) ||
                   (start <= eventStartMinutes && end >= eventEndMinutes);
        });
    };

    const timeSlots = [];
    for (let hour = 9; hour < 18; hour++) {
        for (let minute of [0, 15, 30, 45]) {
            const startMinutes = hour * 60 + minute;
            const endMinutes = startMinutes + procedureDuration;
            
            if (endMinutes > 18 * 60) continue;
            
            const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            
            if (isTimeSlotAvailable(startMinutes, endMinutes, todayEvents, startMinutes)) {
                timeSlots.push(startTime);
            }
        }
    }

    const keyboard = timeSlots.map(time => ({
        text: time,
        callback_data: `time_${procedureIndex}_${selectedDate}_${time}`
    }));

    const keyboardLayout = [];
    for (let i = 0; i < keyboard.length; i += 4) {
        keyboardLayout.push(keyboard.slice(i, i + 4));
    }

    return { inline_keyboard: keyboardLayout };
};



export default generateTimeKeyboard;