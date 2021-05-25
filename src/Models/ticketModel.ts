const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    customer_name: String,
    performance_title : String,
    performance_time : Date,
    ticket_price : Number,
});

export const ticket = mongoose.model('ticket', ticketSchema);

