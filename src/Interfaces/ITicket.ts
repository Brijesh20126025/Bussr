export interface ITicket {
    customer_name : string,
    performance_title : string,
    performance_time : Date,
    ticket_price : Number,
    ticket_creation_month?: string // this field will be used to fecth the data month wise.
    ticket_creation_year?: string // for analytics at year level, easy aggreagation query
    ticket_creation_day?: string,
    /*
        user_id will not be provided explicitly from the user.
        we will retrive it from the token in auth middleware and
        we will set it on req object and during the the DB data creation
        we will get it from req onject and will insert.

        this user id will be used for the anlytics purpose in ticket table.
    */
    user_id?: string // users to which this ticket is being assigned.
}