import {Request, Response } from 'express';
import { IError } from '../Interfaces/IError';
import { constants } from '../Constants/constants';
import { DbService } from '../DbService';
import {collectionNames} from '../DbService/collectionsName';
import * as connectionManger from '../DbService/workerConnection';
import * as dateUtils from '../utils/dateUtils';
import {ManualAnalytics} from './manualAnalytics/manualAnalyticsHelper';
import * as _ from 'lodash';

class Analytics {

    // analytics based on month basis.
    static async profitAnalytics(req : Request, res : Response, next : Function) {

        if(!req || !req.query || !req.query.start_date || !req.query.end_date) {
            let error : IError = {
                status : 400,
                message : 'Missing data/info'
            }
            return next(error);
        }
        //req will contain two dates & analytics method b/w which we need to perform the analytics.
        let startDate : any = req.query.start_date;
        let endDate : any = req.query.end_date;
        let analyticsMethod : any = req.query.method;

        if(!dateUtils.isValidDateString(startDate) || !dateUtils.isValidDateString(endDate)) {
            let error : IError = {
                status : 400,
                message : 'invalid start/end date provided',
                data : {
                    start_date : startDate,
                    end_date : endDate
                }
            }
            return next(error);
        }

        try {
            startDate = dateUtils.convertToDate(startDate);
            endDate = dateUtils.convertToDate(endDate);
        } catch(ex : any) {

            console.log('### Analytics :: Exception date converting ', ex && ex.message);
            let error : IError = {
                status : 500,
                message : 'Exception converting the start/end date to date type',
                data : {
                    start_date : req.query.start_date,
                    end_date : req.query.end_date
                }
            }
            return next(error);
        }

        // manual method(Js algo) to find out the analytics.
        if(analyticsMethod === constants.analyticsMethod[0]) {
            // run the manual pipeline.
            let manualResult : {err : any, result : any[] } = await ManualAnalytics.performManualProfitAnalytics(startDate, endDate);
            if(manualResult.err) {
                let error : IError = {status : 500, message :"Something went wrong. please try again", data : manualResult.err};
                console.error("### Analytics :: manual :: creation :: unexpected error");
                return next(error);
            }
            res.status(200).json({
                status : 200,
                message : "Successfully fetched the manual analytics data",
                data : manualResult.result
            });
        }

        // prepare the aggregation query for analytics.
        let aggregateQueryPipeline : any[] = [
            { "$match": {'$and' : [{'performance_time':{$gte: startDate}},{'performance_time':{$lte: endDate}}, { 'ticket_creation_month' : {"$ne" : null} }] } },
            { "$group": { _id: "$ticket_creation_month", profitSummary: { $sum: "$ticket_price" } } },
            { "$sort" : {"profitSummary" : -1} },
            {"$project" : {_id : 0, 'month' : "$_id", profitSummary : '$profitSummary'}}
        ];

        // acquire connection and fire the query.
        let conn : {err : any, connection : any} = await connectionManger.DbService.connectSync(constants.dbName);
        if(conn.err) {
            let error : IError = {status : 500, message :"Something went wrong. please try again"};
            console.error("### ticket :: creation :: error in db connection acquire");
            return next(error);
        }
        let dbConn = conn.connection;

        let ops = {maxTimeMS : 6000, allowDiskUse : true};

        let aggregationResult : {err : any, result : any} = await DbService.DatabaseService.aggregationWithOptions(dbConn, collectionNames.ticket, aggregateQueryPipeline, ops);

        if(aggregationResult.err) {
            let error : IError = {
                status : 500, 
                message : "Error fetching the analytics data for tickets. Try again!",
                data : aggregationResult.err
            };
            console.error("### Analtyics :: deletion :: error in db data delete ", aggregationResult.err);
            return next(error);
        }

        res.status(200).json({
            status : 200,
            message : "Successfully fetched the aggreagation analytics data",
            data : aggregationResult.result
        });
        return;
    }

    static async userAnalytics(req : Request, res : Response, next : Function) {
        if(!req || !req.query || !req.query.start_date || !req.query.end_date) {
            let error : IError = {
                status : 400,
                message : 'Missing data/info'
            }
            return next(error);
        }
        //req will contain two dates & analytics method b/w which we need to perform the analytics.
        let startDate : any = req.query.start_date;
        let endDate : any = req.query.end_date;

        // fallback analytics method is assumed to be DB aggregation
        let analyticsMethod : any = !(req.query.analytics_method) ? constants.analyticsMethod[1] : req.query.analytics_method;

        if(!dateUtils.isValidDateString(startDate) || !dateUtils.isValidDateString(endDate)) {
            let error : IError = {
                status : 400,
                message : 'invalid start/end date provided',
                data : {
                    start_date : startDate,
                    end_date : endDate
                }
            }
            return next(error);
        }

        try {
            startDate = dateUtils.convertToDate(startDate);
            endDate = dateUtils.convertToDate(endDate);
        } catch(ex : any) {
            console.error('### Analytics :: Exception date converting ', ex && ex.message);
            let error : IError = {
                status : 500,
                message : 'Exception converting the start/end date to date type',
                data : {
                    start_date : req.query.start_date,
                    end_date : req.query.end_date
                }
            }
            return next(error);
        }

        // manual method(Js algo) to find out the analytics.
        if(analyticsMethod === constants.analyticsMethod[0]) {
            // run the manual pipeline.
            let manualResult : {err : any, result : any[] } = await ManualAnalytics.performManualUserAnalytics(startDate, endDate);
            if(manualResult.err) {
                let error : IError = {status : 500, message :"Something went wrong. please try again", data : manualResult.err};
                console.error("### Analytics :: manual :: creation :: unexpected error");
                return next(error);
            }
            res.status(200).json({
                status : 200,
                message : "Successfully fetched the manual analytics data",
                data : manualResult.result
            });
        }

        // prepare the aggregation query for analytics.
        let aggregateQueryPipeline : any[] = [
            { "$match": {'$and' : [{'performance_time':{$gte: startDate}},{'performance_time':{$lte: endDate}}, { 'ticket_creation_month' : {"$ne" : null} }, {'user_id' : {"$ne" : null}}] } },
            { "$group": { _id: "$ticket_creation_month", total_people_visited: { $sum: 1 } } },
            { "$sort" : {"total_people_visited" : -1} },
            {"$project" : {_id : 0, 'month' : "$_id", total_people_visited : '$total_people_visited'}}
        ];

        // acquire connection and fire the query.
        let conn : {err : any, connection : any} = await connectionManger.DbService.connectSync(constants.dbName);
        if(conn.err) {
            let error : IError = {status : 500, message :"Something went wrong. please try again"};
            console.error("### Analytics :: user :: creation :: error in db connection acquire");
            return next(error);
        }
        let dbConn = conn.connection;

        let ops = {maxTimeMS : 6000, allowDiskUse : true};

        let aggregationResult : {err : any, result : any} = await DbService.DatabaseService.aggregationWithOptions(dbConn, collectionNames.ticket, aggregateQueryPipeline, ops);

        if(aggregationResult.err) {
            let error : IError = {
                status : 500, 
                message : "Error fetching the analytics data for tickets. Try again!",
                data : aggregationResult.err
            };
            console.error("### Analtyics :: deletion :: error in db data delete ", aggregationResult.err);
            return next(error);
        }

        res.status(200).json({
            status : 200,
            message : "Successfully fetched the aggreagation analytics data",
            data : aggregationResult.result
        });
        return;
    }
}

export { Analytics };