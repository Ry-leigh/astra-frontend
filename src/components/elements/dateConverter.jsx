export default function dateConverter(date) {
    const dateObject = new Date(date);

    // Options for the desired format: "Nov 11 2025" (Note: date in input is Nov 6th)
    const options = {
    // year: 'numeric',
    month: 'short', // "Nov"
    day: 'numeric', // "6"
    };

    // Format the date using the options and a specific locale (e.g., 'en-US')
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);

    // In your JSX:
    
    return `${formattedDate}`
}
