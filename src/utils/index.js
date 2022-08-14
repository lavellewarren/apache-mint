import {
    intervalToDuration,
    formatDuration,
    format,
    addMinutes
} from 'date-fns';

export function formatElapsedTime(start, end) {
    console.log(start, end, 'start, end')
    const duration = intervalToDuration({ start: new Date(start), end: new Date(end) });
    return formatDuration(duration, {format: ['days', 'hours', 'minutes', 'seconds']})
        .replace(' days', 'd')
        .replace(' day', 'd')
        .replace(' hours', 'h')
        .replace(' hour', 'h')
        .replace(' minutes', 'm')
        .replace(' minute', 'm')
        .replace(' seconds', 's')
        .replace(' second', 's');
}

export function formatUTC(timestamp) {
    return `${format(addMinutes(timestamp * 1000, new Date(timestamp).getTimezoneOffset()), 'EEEE, do MMMM haaa UTC')} UTC`;
}

export const CNDY_STATUS = {
    notStarted: 0,
    private: 1,
    public: 2,
    ended: 3
};
