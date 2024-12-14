/* Convert Time to AM or PM */
const convertToAmPm = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const isPm = hourNum >= 12;
    const amPmHour = hourNum % 12 || 12; /* Convert 0 to 12 for 12 AM */
    return `${amPmHour}:${minute} ${isPm ? "PM" : "AM"}`;
};

/* Convert Time to 24 Hour Format */
function convertTo24HourFormat(time12hr) {
    /* Split time and AM/PM */
    const [time, modifier] = time12hr.split(" ");
    /* Split hours and minutes */
    let [hours, minutes] = time.split(":");

    /* Convert hours to a number */
    hours = parseInt(hours);

    /* Check if the time is PM and the hour is not 12 (because 12 PM is already in 24-hour format),
    else if time is AM and the hour is 12 then convert the hour to the 24-hour format. */
    if (modifier === "PM" && hours !== 12) {
        hours += 12;  /* Convert PM times (except 12 PM) to 24-hour format */
    } else if (modifier === "AM" && hours === 12) {
        hours = 0;  /* Convert 12 AM to 00 (midnight) */
    }

    /* Return the formatted hours and minutes in 24-hour format */
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/* Make first letter to be capitalized */
const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
};

export { convertToAmPm, convertTo24HourFormat, capitalizeFirstLetter };