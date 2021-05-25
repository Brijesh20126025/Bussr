import moment from 'moment';


export function convertToDate(dateString : string) : Date {

    let date = moment(dateString, 'DD/MM/YYYY h.mm.ss');

    // if invalid date string fallback to current date.
    if(!date.isValid()) {

        console.error("########### Invalid Date ", dateString);
        return new Date();
    }

    let newDate : any = moment(dateString, 'DD/MM/YYYY h.mm.ss').format('DD/MM/YYYY h.mm.ss');

    return newDate;
}

export function isValidDateString(dateString : string) : Boolean {
    const date = moment(dateString, 'DD/MM/YYYY h.mm.ss');

    if(!date.isValid())
        return false;
    return true;
}

export function getMonthFromDate(date : string) : string {

    // if not valid date string provided throw an error.
    if(!isValidDateString(date))
        throw new Error('Invalid date string');

    // returns "1" for jan, "2"  for feb ....
    return moment(date, 'DD/MM/YYYY h.mm.ss').format('M');
}

export function getMonthNameFromMonthNumber(monthNumber : number) : string {

    if(isNaN(monthNumber))
        return "";
    const months = [ "January", "February", "March", "April", 
                     "May", "June","July", "August", 
                     "September", "October","November", "December" ];

    return months[monthNumber - 1];
}