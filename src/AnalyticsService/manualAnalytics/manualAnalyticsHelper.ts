import {Request, Response } from 'express';
import { IError } from '../../Interfaces/IError';
import { constants } from '../../Constants/constants';
import { DbService } from '../../DbService';
import {collectionNames} from '../../DbService/collectionsName';
import * as connectionManger from '../../DbService/workerConnection';
import * as dateUtils from '../../utils/dateUtils';
import * as _ from 'lodash';
import { ITicket } from '../../Interfaces/ITicket';

class ManualAnalytics {

    static async performManualProfitAnalytics(startDate : Date, endDate : Date) : Promise<{err : any, result : any[]}> {

        // find all the data b/w these two dates and apply the ALGO to find the aggreagation.
        let findQuery = {$and : [{'performance_time':{$gte: startDate}},{'performance_time':{$lte: endDate}}, { 'ticket_creation_month' : {"$ne" : null} }]}

         // acquire connection and fire the query.
         let conn : {err : any, connection : any} = await connectionManger.DbService.connectSync(constants.dbName);
         if(conn.err) {
             console.error("### profit Analytics :: manual :: creation :: error in db connection acquire");
             return {err : conn.err, result : []};
         }

         let dbConn = conn.connection;

         let findResult : {err : any, result : any[]} = await DbService.DatabaseService.findManyWithOptions(dbConn, collectionNames.ticket, findQuery, {});

         if(findResult.err) {
            console.error("### Profit Analytics : manual : performManualAnalytics - error in fetching the data");
            return {err : findResult.err, result : []};
        }

         // apply logic and convert the data into aggreagate format.
         let aggreagatedData : any[] = aggreagateProfitAnalyticsData(findResult.result);
         return {err : null, result : aggreagatedData};
    }

    static async performManualUserAnalytics(startDate : Date, endDate : Date) : Promise<{err : any, result : any[]}> {

        // find all the data b/w these two dates and apply the ALGO to find the aggreagation.
        let findQuery = {$and : [{'performance_time':{$gte: startDate}},{'performance_time':{$lte: endDate}}, { 'user_id' : {"$ne" : null} }, { 'ticket_creation_month' : {"$ne" : null} }]}

         // acquire connection and fire the query.
         let conn : {err : any, connection : any} = await connectionManger.DbService.connectSync(constants.dbName);
         if(conn.err) {
             console.error("### User Analytics :: manual :: creation :: error in db connection acquire");
             return {err : conn.err, result : []};
         }

         let dbConn = conn.connection;

         let findResult : {err : any, result : any[]} = await DbService.DatabaseService.findManyWithOptions(dbConn, collectionNames.ticket, findQuery, {});

         if(findResult.err) {
            console.error("### User Analytics : manual : performManualAnalytics - error in fetching the data");
            return {err : findResult.err, result : []};
        }

         // apply logic and convert the data into aggreagate format.
         let aggreagatedData : any[] = aggreagateUserAnalyticsData(findResult.result);
         return {err : null, result : aggreagatedData};
    }
}

function aggreagateUserAnalyticsData(data : any[]) {
    try {
        let map : any = {};
        let aggreagationData : any[] = [];
        for(let i = 0; i < data.length; i++) {

            const doc : ITicket =  data[i];
            let ticket_creation_month : any = doc.ticket_creation_month;
            if(ticket_creation_month) {
                map[ticket_creation_month] = (map[ticket_creation_month] ? map[ticket_creation_month] + 1 : 1);
            }
        }

        Object.keys(map).forEach((key) => {
            if(map[key]) {
                let localData : any = {
                    month : key,
                    total_visited_people : Number(map[key])
                }
                aggreagationData.push(localData);
            }
        })

        aggreagationData = _.orderBy(aggreagationData, 'total_visited_people', 'desc');
        // aggreagationData.sort((a : any, b : any) => {
        //     return b[1] - a[1];
        // });
        // // sort the count/sum in descending order.
        // //customSort(aggreagationData);

        console.log("Aggregated Data in sorted order user analytics %j", aggreagationData);

        return aggreagationData;
    }
    catch(ex : any) {
        console.error("### User Analytics : manual : aggreagateData - error in creating the manual aggreagate data");
        return [];
    }
}

function customSort(data : any[]) {
    data.sort((i1 : any, i2 : any) => {
        return i1[1] - i2[1];
    });
}

function aggreagateProfitAnalyticsData(data : any[]) : any[] {

    try {
        let map : any = {};
        let aggreagationData : any[] = [];
        for(let i = 0; i < data.length; i++) {

            const doc : ITicket =  data[i];
            let ticket_creation_month : any = doc.ticket_creation_month;
            if(ticket_creation_month) {
                map[ticket_creation_month] = (map[ticket_creation_month] ? map[ticket_creation_month] : 0) + doc.ticket_price;
            }
        }

        Object.keys(map).forEach((key) => {
            if(map[key]) {
                let localData : any = {
                    month : key,
                    profitSummary : map[key]
                }
                aggreagationData.push(localData);
            }
        })

        aggreagationData = _.orderBy(aggreagationData, 'profitSummary', 'desc');
        //  // sort the count/sum in descending order.
        //  customSort(aggreagationData);
        //  console.log("Aggregated Data in sorted order profit analytics %j", aggreagationData);

        return aggreagationData;
    }
    catch(ex : any) {
        console.error("### Profit Analytics : manual : aggreagateData - error in creating the manual aggreagate data");
        return [];
    }
}

export {ManualAnalytics};