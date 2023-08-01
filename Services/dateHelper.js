export function getCurrentDate(dateToFormat) {
    const month = dateToFormat.getMonth() + 1; // getMonth() is zero-based
    const year = dateToFormat.getFullYear();

    return `${month < 10 ? '0' : ''}${month}/${year}`; // padding zero if month < 10
};
