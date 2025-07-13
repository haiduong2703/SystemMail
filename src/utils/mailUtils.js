/**
 * Formats a date array or string into a "DD/MM/YYYY HH:mm" string.
 * @param {Array<string>|string} dateInput - The date input, can be an array [YYYY-MM-DD, HH:mm] or an ISO string.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";

    let date;
    if (Array.isArray(dateInput)) {
        // Handles format ["YYYY-MM-DD", "HH:mm"]
        date = new Date(`${dateInput[0]}T${dateInput[1]}:00`);
    } else {
        // Handles standard ISO string or other date string formats
        date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Filters an array of mails by a given date range.
 * @param {Array<Object>} mails - The array of mail objects to filter.
 * @param {Date|string|null} startDate - The start of the date range.
 * @param {Date|string|null} endDate - The end of the date range.
 * @returns {Array<Object>} - The filtered array of mails.
 */
export const filterMailsByDateRange = (mails, startDate, endDate) => {
    if (!startDate && !endDate) {
        return mails;
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Set time to 00:00:00 for start date and 23:59:59 for end date for inclusive filtering
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    return mails.filter(mail => {
        if (!mail.Date) return false;

        let mailDate;
        if (Array.isArray(mail.Date)) {
            mailDate = new Date(`${mail.Date[0]}T${mail.Date[1]}:00`);
        } else {
            mailDate = new Date(mail.Date);
        }

        if (isNaN(mailDate.getTime())) return false;

        if (start && mailDate < start) {
            return false;
        }
        if (end && mailDate > end) {
            return false;
        }
        return true;
    });
}; 