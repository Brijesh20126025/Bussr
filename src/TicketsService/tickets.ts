import express, {Router, Request, Response } from 'express';
import { IError } from '../Interfaces/IError';
import { constants } from '../Constants/constants';
import { ITicket } from '../Interfaces/ITicket';
import { DbService } from '../DbService';
import {collectionNames} from '../DbService/collectionsName';
import * as connectionManger from '../DbService/workerConnection';
const ObjectId = require('mongodb').ObjectID;
const joi  = require('joi');
import * as dateUtils from '../utils/dateUtils';
import * as _ from 'lodash';
import { isArray } from 'lodash';


class Tickets {

    // ticket create
    static async createTickets(req : any, res : Response, next : Function) {

        console.log("######## REQ body in app %j", req.body);
        if(!req || !req.body || !req.body.ticketData) {
            let error : IError = {status : 400, message :"Missing required data/info"};
            return next(error);
        }

        let ticketData : any[] = req.body.ticketData;

        // validate the user input data.
        let schema;
        schema = joi.array().items(
                    joi.object().keys({
                        customer_name : joi.string().required(), 
                        performance_title: joi.string().required(), 
                        ticket_price: joi.number().required(), 
                        performance_time: joi.string().required(), 
                    }).min(4).required()
                );
        const {error, value} = schema.validate(ticketData);
        if(error) {
            console.error("##### Joi validation Error %j", error, value);
            let ApiError : IError = {
                status : 400, 
                message :"invalid data type info passed. pass the required type data",
                data : error
            };
            return next(ApiError);
        }
        // check if date string provided is valid date or not.
        for(let i = 0; i < ticketData.length; i++) {
            let isValid : Boolean = dateUtils.isValidDateString(ticketData[i].performance_time);
            if(!isValid) {
                let error : IError = {
                    status : 400,
                    data : ticketData[i],
                    message : "Invalid performance time provided for this ticket data (sample ex - DD/MM/YYYY 10:30 400",
                }
                return next(error);
            }
        }

        let dbTicketData : ITicket[] = [];

        for(let i = 0; i < ticketData.length; i++) {
            let month : string = dateUtils.getMonthFromDate(ticketData[i].performance_time);

            if(isNaN(Number(month))) {
                let error : IError = {
                    status : 400,
                    message : 'invlaid date format(performace_time)',
                    data: ticketData[i]
                }
                return next(error);
            }
            let dataToInsert : ITicket = {
                 customer_name : ticketData[i].customer_name,
                 performance_title : ticketData[i].performance_title,
                 performance_time : dateUtils.convertToDate(ticketData[i].performance_time),
                 ticket_creation_month : dateUtils.getMonthNameFromMonthNumber(Number(month)),
                 ticket_price : ticketData[i].ticket_price,
                 user_id : req && req.user_id && req.user_id // insert the user_id which we had set in auth middleware we got if from the jwt token in auth layer.
            }

            dbTicketData.push(dataToInsert);
        }

        // create connection and insert this data in db.
        let conn : {err : any, connection : any} = await connectionManger.DbService.connectSync(constants.dbName);
        if(conn.err) {
            let error : IError = {status : 500, message :"Something went wrong. please try again"};
            console.error("### ticket :: creation :: error in db connection acquire");
            return next(error);
        }
        let dbConn = conn.connection;
        let insertResult : {err : any , result : any}  = {err : null, result : null};

        try {
            insertResult = await DbService.DatabaseService.insertManySync(dbConn, collectionNames.ticket, dbTicketData);
        }
        catch(ex : any) {
            let error : IError = {status : 500, message :"Something went wrong. Please ensure to pass the correct data. Please try again", data : ex};
            console.error("### ticket :: creation :: error in db query");
            return next(error);
        }

        if(insertResult.err) {
            let error : IError = {status : 500, message :"Error creating the tickets. Try again!"};
            console.error("### ticket :: creation :: error in db data insert");
            return next(error);
        }

        // send the response that creation was successful.
        res.status(200).json(
            {
                status : 200, 
                message : "tickets created successfully!!", 
                insertedCount : _.get(insertResult.result, 'insertedCount', 0),
                insertedIds : _.get(insertResult.result, 'insertedIds', [])
            }
        );
    }

    /*   ticket update. Allowing only the single update.
         if multiple update request in form of array only first
         data of array will be updated.
    */
    static async upodateTickets(req : Request, res : Response, next : Function) {

        console.log("===== Update in application ", req.body);
        console.log("===== Update in application ", req.params);
        if(!req || !req.body || !req.body.ticketUpdateData || !req.params.ticket_id) {
            let error : IError = {status : 400, message :"Missing required data/info"};
            return next(error);
        }

        let ticketId : string = req.params.ticket_id;

        // validate if this passed id can be converted into 
        // valid mongo db object Id. if not return error.
        let isValid : Boolean = ObjectId(ticketId).toString() === ticketId ? true : false; //true/false
        if(!isValid) {
            let error : IError = {status : 400, message :"Given id is not a valid id. Provide the correct Id"};
            return next(error);
        }

        // assuming single update allowed.
        let ticketUpdateData : any = isArray(req.body.ticketUpdateData) ? 
                                     req.body.ticketUpdateData[0] : req.body.ticketUpdateData;

        // prepare the update statements.
        let ticket_id : any = null;
        try {
            ticket_id = ObjectId(ticketId);
        }
        catch(ex : any) {
            let error : IError = {status : 500, message :"Incorrect ticket_id provided. Try again with valid Id"};
            console.error("###### try block ticket :: updation :: error in converting the ticket_id to mongo ObjectId data update ", ex);
            return next(error);
        }

        let updateStatement : any = {
            "$set" : {}
        }
        let filter = {_id : ticket_id};

        Object.keys(ticketUpdateData).forEach((key) => {

            if(ticketUpdateData[key]) {
                updateStatement['$set'][key] = ticketUpdateData[key];
            }
        });

        // We need to update the ticket_creation_month if we are updating the 
        // perfomance_time field.
        let performance_time_data : string = ticketUpdateData.performance_time;
        if(performance_time_data && dateUtils.isValidDateString(performance_time_data)) {
            let month = dateUtils.getMonthNameFromMonthNumber(Number(dateUtils.getMonthFromDate(performance_time_data)));
            updateStatement['$set']['ticket_creation_month'] = month;
        }

        // create connection and update this data in db.
        let conn : {err : any, connection : any} = await connectionManger.DbService.connectSync(constants.dbName);

        if(conn.err) {
            let error : IError = {status : 500, message :"Something went wrong. please try again"};
            console.error("### ticket :: updation :: error in db connection acquire");
            return next(error);
        }

        let dbConn = conn.connection;
        let updateResult : {err : any , result : any} = {err : null, result : null};

        try {
            updateResult = await DbService.DatabaseService.updateOneWithOptions(dbConn, collectionNames.ticket, filter, updateStatement, {upsert : true, multi : true});
        }
        catch(ex : any) {
            let error : IError = {status : 500, message :"Something went wrong. Please ensure to pass the correct data. Please try again", data : ex};
            console.error("### ticket :: updation :: error in db query");
            return next(error);
        }

        if(updateResult.err) {
            let error : IError = {status : 500, message :"Error updating the tickets. Try again!"};
            console.error("### ticket :: updation :: error in db data update ", updateResult.err);
            return next(error);
        }

        // send the response that updation was successful.
        let message : string = "tickets updated successfully!!";
        let ticketUpdateCount : number =  _.get(updateResult.result, 'modifiedCount', 0);

        if(!ticketUpdateCount || ticketUpdateCount == 0)
            message = "No update performed. requested update data not found";
        res.status(200).json(
            {
                status : 200, message : message, 
                ticketUpdateCount : ticketUpdateCount
            }
        );
    }

    // user can delete the many tickets together.
    static async deleteTickets(req : Request, res : Response, next : Function) {
        if(!req || !req.body || !req.body.deleteIds) {
            let error : IError = {status : 400, message :"Missing required data/info"};
            return next(error);
        }
        let Ids : string[] = req.body.deleteIds;   

        let objectIds : any[] = [];
        for(let i = 0; i < Ids.length; i++) {
            let objId : any = ObjectId(Ids[i]);
            objectIds.push(objId);
        }
        let deleteQuery : any = {
            _id : {"$in" : objectIds}
        }

        // create connection and delete this data from db.
        let conn : {err : any, connection : any} = await connectionManger.DbService.connectSync(constants.dbName);

        if(conn.err) {
            let error : IError = {status : 500, message :"Something went wrong. please try again"};
            console.error("### ticket :: deletion :: error in db connection acquire");
            return next(error);
        }

        let dbConn = conn.connection;
        let deleteResult : {err : any , result : any} = {err : null, result : null};

        try {
            deleteResult = await DbService.DatabaseService.deleteManyWithOptions(dbConn, collectionNames.ticket, deleteQuery, {multi : true});
        }
        catch(ex : any) {
            let error : IError = {status : 500, message :"Something went wrong. Please ensure to pass the correct data. Please try again", data : ex};
            console.error("### ticket :: deletion :: error in db query");
            return next(error);
        }

        if(deleteResult.err) {
            let error : IError = {status : 500, message :"Error deleting the tickets. Try again!"};
            console.error("### ticket :: deletion :: error in db data delete ", deleteResult.err);
            return next(error);
        }

        // send the response that deletion was successful.
        res.status(200).json(
            {
                status : 200, message : "tickets deleted successfully!!", 
                deletedCount : _.get(deleteResult.result, 'deletedCount', 0)
            }
        );
    }
}

export { Tickets };

