import { format } from 'date-fns/fp';
import { reduce } from 'ramda';

export const formatDateTime = format('yyyy-MM-dd\'T\'HH:mm:ss');

export const getDatePlusDay = format('dd eee');

export const groupEventsByDayPlusDate = reduce((acc, event) => {
    const datePlusDay = getDatePlusDay(event.start_date);
    if (!acc[datePlusDay]) {
        acc[datePlusDay] = [];
    }
    acc[datePlusDay].push(event);
    return acc;
})({});