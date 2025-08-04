import { format, addDays, isAfter, isSameDay } from 'date-fns/fp';
import { reduce, isNil, isEmpty } from 'ramda';

export const formatDateTime = format('yyyy-MM-dd\'T\'HH:mm:ss');

export const getDatePlusDay = format('eee, LLL dd');

export const createCalendar = (baseDate) => {
    const startDate = addDays(-1)(baseDate);
    const endDate = addDays(10)(baseDate);

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

export const findMatchingDate = (dates, day) => {
    if (isNil(day) || isNil(dates) || isEmpty(dates)) {
        return null;
    }
    for (const date of dates) {
        if (isSameDay(date, day)) {
            return date;
        }
    }
    return null;
}
