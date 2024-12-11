/* Convert Time to AM or PM */
const convertToAmPm = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const isPm = hourNum >= 12;
    const amPmHour = hourNum % 12 || 12; /* Convert 0 to 12 for 12 AM */
    return `${amPmHour}:${minute} ${isPm ? "PM" : "AM"}`;
};

/* Make first letter to be capitalized */
const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
};

export { convertToAmPm, capitalizeFirstLetter };