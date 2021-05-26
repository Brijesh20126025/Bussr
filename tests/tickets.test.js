"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('request');
/*
    Create Ticket Test
*/
let port = process.env.PORT || 5000;
let baseUrl = `http://localhost:${port}`;
describe('Create Ticket Test', () => {
    let requestBody = {
        "ticketData": [
            {
                "customer_name": "Bussr user",
                "performance_title": "Bussr test title",
                "ticket_price": 40,
                "performance_time": "24/05/2021 12:30"
            },
            {
                "customer_name": "Bussr user",
                "performance_title": "Bussr test title",
                "ticket_price": 40,
                "performance_time": "24/05/2021 12:30"
            },
            {
                "customer_name": "Bussr user",
                "performance_title": "Bussr test title",
                "ticket_price": 40,
                "performance_time": "24/05/2021 12:30"
            }, {
                "customer_name": "Bussr user",
                "performance_title": "Bussr test title",
                "ticket_price": 40,
                "performance_time": "24/05/2021 12:30"
            }, {
                "customer_name": "Bussr user",
                "performance_title": "Bussr test title",
                "ticket_price": 40,
                "performance_time": "24/05/2021 12:30"
            }, {
                "customer_name": "Bussr user",
                "performance_title": "Bussr test title",
                "ticket_price": 40,
                "performance_time": "24/05/2021 12:30"
            }, {
                "customer_name": "Bussr user",
                "performance_title": "Bussr test title",
                "ticket_price": 40,
                "performance_time": "24/05/2021 12:30"
            }
        ]
    };
    it('should return create a ticket', (done) => {
        request.post(`${baseUrl}/api/v1/tickets/createTickets`, (err, res, body) => {
            console.log("############# Request Error ", err);
            console.log("############# Request Error 2", res);
            // there should be a 200 status code
            res.statusCode.should.eql(200);
            // the response should be JSON
            res.headers['content-type'].should.contain('application/json');
            // parse response body
            body = JSON.parse(body);
            // the JSON response body should have a
            // key-value pair of {"status": "success"}
            body.status.should.eql('success');
            // the JSON response body should have a
            // key-value pair of {"data": [3 movie objects]}
            body.data.length.should.eql(3);
            // the first object in the data array should
            // have the right keys
            body.data[0].should.include.keys('id', 'name', 'genre', 'rating', 'explicit');
            // the first object should have the right value for name
            body.data[0].name.should.eql('The Land Before Time');
            done();
        });
    });
});
