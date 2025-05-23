import { format, addDays, isAfter } from 'date-fns/fp';
import { reduce } from 'ramda';

export const formatDateTime = format('yyyy-MM-dd\'T\'HH:mm:ss');

export const getDatePlusDay = format('eee, LLL dd');

export const createCalendar = (baseDate) => {
    const startDate = addDays(-1)(baseDate);
    const endDate = addDays(14)(baseDate);

    const calendar = {};
    for (let date = startDate; !isAfter(endDate)(date); date = addDays(1)(date)) {
        const datePlusDay = getDatePlusDay(date);
        calendar[datePlusDay] = [];
    }
    return calendar;
}

export const groupEventsByDayPlusDate = reduce((acc, event) => {
    const datePlusDay = getDatePlusDay(event.start_date);
    acc[datePlusDay].push(event);
    return acc;
});
