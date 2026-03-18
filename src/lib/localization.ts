/**
 * PostHuman Music Studio: Localization Utilities
 * Standards: British English, GBP, dd/mm/yyyy, Sunday Start
 */

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    }).format(amount);
};

export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

/**
 * Formats date as 'Monday, 10th March 2026'
 */
export const formatLongDate = (date: Date) => {
    const day = date.getDate();
    const dayOfWeek = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
    const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
    const year = date.getFullYear();

    // Add ordinal suffix (st, nd, rd, th)
    const j = day % 10, k = day % 100;
    let suffix = "th";
    if (j === 1 && k !== 11) suffix = "st";
    if (j === 2 && k !== 12) suffix = "nd";
    if (j === 3 && k !== 13) suffix = "rd";

    return `${dayOfWeek}, ${day}${suffix} ${month} ${year}`;
};

export const firstDayOfWeek = 0; // Sunday
