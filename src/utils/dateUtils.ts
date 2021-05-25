import moment from 'moment';


export function covertToDate(dateString : string) : Date {

    let date = moment(dateString);

    // if invalid date string fallback to current date.
    if(!date.isValid()) {
        return new Date();
    }

    let newDate : any = moment(dateString, 'DD/MM/YYYY').format('DD/MM/YYYY');

    return newDate;
}

export function isValidDateString(dateString : string) : Boolean {
    const date = moment(dateString, 'DD/MM/YYYY');

    if(!date.isValid())
        return false;
    return true;
}

export function getMonthFromDate(date : string) : string {

    // if not valid date string provided throw an error.
    if(!isValidDateString(date))
        throw new Error('Invalid date string');

    return moment(date, 'DD/MM/YYYY').format('M');
}

export function getMonthNameFromMonthNumber(monthNumber : number) : string {
    const months = [ "January", "February", "March", "April", 
                     "May", "June","July", "August", 
                     "September", "October","November", "December" ];

    return months[monthNumber - 1];
}