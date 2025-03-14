import {
    filter,
    intersection,
    isNotEmpty,
} from 'ramda';

export const filterEventsbyTags = (tags) => filter((event) => {
    return isNotEmpty(intersection(event.tag_ids, tags));
});