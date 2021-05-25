import express, { Router, Request, Response } from "express";
import { Users} from "../../../AuthService/users";
import { Tickets } from '../../../TicketsService/tickets'
import { ErrorService } from '../../../ErrorService/error';
import { Analytics } from '../../../AnalyticsService/analytics'

const router : Router = express.Router();

// API to analytics the profit on monthly basis.
/**
 * @swagger
 * /api/v1/analytics/profitAnalytics:
 *   get:
 *     tags:
 *       - getProfitAnalytics
 *     description: get the monthly analytics of ticket profit b/w two dates
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 * 
 *     parameters:
 *       - name: start_date
 *         description: start date for analytics data.
 *         in: query
 *         example: 20/05/2021 10:00
 *         schema:
 *           type: string
 *         required: true
 *         
 *       - name: end_date
 *         description: end date for analytics data
 *         in: query
 *         example: 25/05/2021 12:30
 *         schema:
 *            type: string
 *         required: true
 * 
 *       - name: analytics_method
 *         description: analytics method to fetch the data. Default is aggregation
 *         in: query
 *         example: aggregation/manual
 *         type: string
 *         required: true
 *         enum: [ "aggregation", "manual"]
 *         
 *       - name: authorization
 *         description: Authorization header.
 *         in: header
 *         schema: 
 *           type: string
 *           format: uuid
 *         required: true
 *          
 *     responses:
 *       200:
 *         description: Successfully fetched
 *       401:
 *         description: Authorized error
 *       400:
 *         description: Invalid request/data
 *       500:
 *         description: Internal server error
 */
router.get('/profitAnalytics', Users.auth, Analytics.profitAnalytics, ErrorService.error);


// API to analytics the user on monthly basis
/**
 * @swagger
 * /api/v1/analytics/userAnalytics:
 *   get:
 *     tags:
 *       - getUserAnalytics
 *     description: get the monthly analytics of user b/w two dates
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 * 
 *     parameters:
 *       - name: start_date
 *         description: start date for analytics data.
 *         in: query
 *         example: 20/05/2021 10:00
 *         schema:
 *           type: string
 *         required: true
 *         
 *       - name: end_date
 *         description: end date for analytics data
 *         in: query
 *         example: 25/05/2021 12:30
 *         schema:
 *            type: string
 *         required: true
 * 
 *       - name: analytics_method
 *         description: analytics method to fetch the data. Default is aggregation
 *         in: query
 *         example: aggregation/manual
 *         type: string
 *         required: true
 *         enum: [ "aggregation", "manual"]
 *         
 *       - name: authorization
 *         description: Authorization header.
 *         in: header
 *         schema: 
 *           type: string
 *           format: uuid
 *         required: true
 *          
 *     responses:
 *       200:
 *         description: Successfully fetched
 *       401:
 *         description: Authorized error
 *       400:
 *         description: Invalid request/data
 *       500:
 *         description: Internal server error
 */
router.get('/userAnalytics', Users.auth, Analytics.userAnalytics, ErrorService.error);

export { router };