import { expect } from 'chai';
import {Tickets as ticketService} from '../src/TicketsService/tickets';
import {ITicket} from '../src/Interfaces/ITicket';
const request = require('request');
import { DbService,  } from '../src/DbService/workerConnection';
import { DatabaseService  } from '../src/DbService/dbService';
import { collectionNames } from '../src/DbService/collectionsName';
import { ObjectId } from 'mongodb';
import { constants } from '../src/Constants/constants'
import { app } from '../src/app';

/*
    Create Ticket Test
*/

let port = process.env.TEST_SERVER_PORT || 5000;

let baseUrl : string = `http://localhost:${port}`;

describe('------ Ticket Model Tests ------ ', () => {
    // start the server during the npm test run because 
    // some test cases are calling the APIs.
    let server : any = null;
    before(done => {
        console.log("-------------------------------------------------------");
        server = app.listen(port, done);
        console.log("Server running at port " + port);
        console.log('-------------------------------------------------------');
    });
      
    it('Sign up user & get token', (done) => {
        let requestBody : any = {
            "user_name": "bussr@test",
            "password": "bussr@123"
          }
          let reqOpts = {
              method : 'POST',
              body : JSON.stringify(requestBody),
              url : `${baseUrl}/api/v1/users/register`,
              headers : {
                'accept': 'application/json',
                'Content-Type': 'application/json'
              }
          }

        request(reqOpts, (err : any, res : any, body : any) => {
          //  tokenInfo.token = body.result && body.result.token;
            expect(res.statusCode).to.equal(200);
            body = JSON.parse(body);

            expect(body.err).to.equal(false);

            expect(body).to.have.property('result');

            expect(body.result).to.have.property('token');
            done();
        })
    });

    it('Create ticket in DB', (done) => {
        let ticketRequestBody : any = {
            "ticketData": [
            {
                "customer_name": "Bussr test user 1",
                "performance_title": "Bussr test title 1",
                "ticket_price": 20,
                "performance_time": "21/05/2021 12:30"
            },
            {
                "customer_name": "Bussr test user 2",
                "performance_title": "Bussr test title 2",
                "ticket_price": 400,
                "performance_time": "22/04/2021 01:30"
              },
            {
                "customer_name": "Bussr test user 3",
                "performance_title": "Bussr test title 3",
                "ticket_price": 60,
                "performance_time": "23/03/2021 12:40"
            },  
            {
                "customer_name": "Bussr test user 4",
                "performance_title": "Bussr test title 4",
                "ticket_price": 80,
                "performance_time": "22/05/2021 07:30"
            },  
            {
                "customer_name": "Bussr test user 5",
                "performance_title": "Bussr test title 5",
                "ticket_price": 20,
                "performance_time": "23/03/2021 9:30"
            },
            {
                "customer_name": "Bussr test user 6",
                "performance_title": "Bussr test title 6",
                "ticket_price": 20,
                "performance_time": "21/03/2021 9:30"
            },
            {
                "customer_name": "Bussr test user 7",
                "performance_title": "Bussr test title 7",
                "ticket_price": 20,
                "performance_time": "29/05/2021 9:30"
            },
            {
                "customer_name": "Bussr test user 8",
                "performance_title": "Bussr test title 8",
                "ticket_price": 20,
                "performance_time": "24/05/2021 9:30"
            },
            {
                "customer_name": "Bussr test user 9",
                "performance_title": "Bussr test title 9",
                "ticket_price": 20,
                "performance_time": "20/03/2021 9:30"
            },
            {
                "customer_name": "Bussr test user 10",
                "performance_title": "Bussr test title 10",
                "ticket_price": 20,
                "performance_time": "25/05/2021 9:30"
            }
            ]
        };
        
          let signUpBody : any = {
            "user_name": "bussr@test",
            "password": "bussr@123"
          }
          let reqOpts = {
              method : 'POST',
              body : JSON.stringify(signUpBody),
              url : `${baseUrl}/api/v1/users/register`,
              headers : {
                'accept': 'application/json',
                'Content-Type': 'application/json'
              }
          }

        request(reqOpts, (err : any, res : any, body : any) => {
            let tokenInfo = JSON.parse(body);
            let reqOpts = {
                url : `${baseUrl}/api/v1/tickets/createTickets`,
                body : JSON.stringify(ticketRequestBody),
                method : 'POST',
                headers : {
                    'authorization' : tokenInfo.result.token,
                    'accept' : 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            request.post(reqOpts,  (err : any, res : any, body : any) => {
                body = JSON.parse(body);
                expect(res.statusCode).equal(200);
                expect(ticketRequestBody.ticketData.length).equal(Object.keys(body.insertedIds).length)
                expect(body.status).equal(200);
                done();
            })
        })
    })  

    it('Update ticket in DB', (done) => {
        let ticketUpdateRequestBody = {
            "ticketUpdateData": {
              "customer_name": "Bussr test user 1",
              "performance_title": "Bussr test title update from testing flow",
              "ticket_price": 9999999,
              "performance_time": "23/11/2021 12:51"
            }
          }
                    
          let signUpBody : any = {
            "user_name": "bussr@test",
            "password": "bussr@123"
          }
          let reqOpts = {
              method : 'POST',
              body : JSON.stringify(signUpBody),
              url : `${baseUrl}/api/v1/users/register`,
              headers : {
                'accept': 'application/json',
                'Content-Type': 'application/json'
              }
          }

        request(reqOpts, async (err : any, res : any, body : any) => {
            let tokenInfo = JSON.parse(body);

            // after signup get the tickets for this user.
            let connectionManger : {err : any, connection : any} = await DbService.connectSync(constants.dbName);

            if(connectionManger.err) {
                done();
                return;
            }
            const dbConn : any = connectionManger.connection;
            let query = {customer_name : 'Bussr test user 1'};
            let Ids : {err : any, result : any} = await DatabaseService.findManyWithOptions(dbConn, collectionNames.ticket, query, {})
            
            if(Ids.err) {
                done();
                return;
            }
            let ticket_id : any = Ids.result[0]._id;
            let updateReqOpts = {
                url : `${baseUrl}/api/v1/tickets/updateTickets/${ticket_id}`,
                method : 'POST',
                body : JSON.stringify(ticketUpdateRequestBody),
                headers : {
                    'authorization' : tokenInfo.result.token,
                    'accept' : 'application/json',
                    'Content-Type' : 'application/json'
                }
            }

            request.post(updateReqOpts,  (err : any, res : any, body : any) => {
                body = JSON.parse(body);
                expect(res.statusCode).equal(200);
                expect(body.status).equal(200);
                expect(body).to.have.property('ticketUpdateCount');
                expect(Number(body.ticketUpdateCount)).to.satisfy(function(num : number) { return num >= 0; });
                done();
            })
        })
    })  

    it('Delete ticket in DB', (done) => {
        let ticketRequestDeleteBody : any = {
            "ticketData": [
            {
                "customer_name": "Bussr test user 1",
                "performance_title": "Bussr test title 1",
                "ticket_price": 20,
                "performance_time": "21/05/2021 12:30"
            }]
        }
                    
          let signUpBody : any = {
            "user_name": "bussr@test",
            "password": "bussr@123"
          }
          let reqOpts = {
              method : 'POST',
              body : JSON.stringify(signUpBody),
              url : `${baseUrl}/api/v1/users/register`,
              headers : {
                'accept': 'application/json',
                'Content-Type': 'application/json'
              }
          }

        request(reqOpts, async (err : any, res : any, body : any) => {
            let tokenInfo = JSON.parse(body);

            request(reqOpts, (err : any, res : any, body : any) => {
                let tokenInfo = JSON.parse(body);
                let createReqOpts = {
                    url : `${baseUrl}/api/v1/tickets/createTickets`,
                    body : JSON.stringify(ticketRequestDeleteBody),
                    method : 'POST',
                    headers : {
                        'authorization' : tokenInfo.result.token,
                        'accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
                request.post(createReqOpts,  (err : any, res : any, body : any) => {
                    body = JSON.parse(body);
                    let del_ticket_id : any = body.insertedIds['0'];
                    let deleteBody = {
                        "deleteIds": [
                            del_ticket_id
                        ]
                    }
                    let deleteReqOpts = {
                        url : `${baseUrl}/api/v1/tickets/deleteTickets`,
                        body : JSON.stringify(deleteBody),
                        method : 'POST',
                        headers : {
                            'authorization' : tokenInfo.result.token,
                            'accept' : 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                    request(deleteReqOpts, (err : any, res : any, body : any) => {
                        body = JSON.parse(body);
                        expect(res.statusCode).equal(200);
                        expect(body.status).equal(200);
                        expect(body).to.have.property('deletedCount');
                        expect(Number(body.deletedCount)).to.satisfy(function(num : number) { return num >= 0; });
                        done();
                    })
                })
            })
        })
    })
})