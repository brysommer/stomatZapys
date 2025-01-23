const getFutureEventsRange = (year, month, day) => {
    const now = new Date();
    const endOfDay = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T23:59:59+02:00`;
    
    // Якщо запитуваний день - сьогодні, використовуємо поточний час
    if (year === now.getFullYear() && 
        month === (now.getMonth() + 1) && 
        day === now.getDate()) {
        // Форматуємо поточний час у київський часовий пояс
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const startDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${hours}:${minutes}:${seconds}+02:00`;
        return { startDate, endDate: endOfDay };
    }
    
    // Якщо день в майбутньому, повертаємо весь день
    const startDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00+02:00`;
    return { startDate, endDate: endOfDay };
};

export default getFutureEventsRange;