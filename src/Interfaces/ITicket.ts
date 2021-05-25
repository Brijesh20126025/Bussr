export interface ITicket {
    customer_name : String,
    performance_title : String,
    performance_time : string,
    ticket_price : Number,
    ticket_creation_month?: string // this field will be used to fecth the data month wise.
    ticket_creation_year?: string // for analytics at year level, easy aggreagation query
    ticket_creation_day?: string
}