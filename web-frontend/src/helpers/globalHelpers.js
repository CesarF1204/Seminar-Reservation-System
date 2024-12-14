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

/* Convert isoDate to MM/DD/YY for readability */
const convertDateFormat = (isoDate) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Intl.DateTimeFormat("en-US", options).format(new Date(isoDate));
    
    return date;
}

/* Make first letter and other letter after space to be capitalized */
const capitalizeFirstLetter = (str) => {
    return str
        .split(' ')  /* Split the string into words */
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))  /* Capitalize the first letter of each word */
        .join(' ');
};

/* Truncate long sentences */
const truncateSentence = (str) => {
    return str.length > 100 ? str.substring(0, 100) + '...' : str;
}


export { convertToAmPm, convertTo24HourFormat, capitalizeFirstLetter, truncateSentence, convertDateFormat };