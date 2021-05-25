import express, { Router, Request, Response } from "express";
import { Users} from "../../../AuthService/users";
import { Tickets } from '../../../TicketsService/tickets'
import { ErrorService } from '../../../ErrorService/error';

const router : Router = express.Router();

// API to create/issue a ticket to users.

/**
 * @swagger
 * /api/v1/tickets/createTickets:
 *   post:
 *     tags:
 *       - createTickets
 *     description: Creates a new single/multiple tickets
 *     produces:
 *       - application/json
 *     parameters:
 * 
 *       - name: authorization
 *         description: Authorizattion header.
 *         in: header
 *         schema: 
 *           type: string
 *           format: uuid
 *         required: true
 * 
 *       - name: ticketData
 *         description:  Array of json objects of ticket data.
 *         in: body
 *         required: true
 *         type : object
 *         properties:
 *             ticketData:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                     customer_name:
 *                       type: string
 *                     performance_title:
 *                       type: string
 *                     ticket_price:
 *                       type: number
 *                     performance_time:
 *                       type: string
 *         example:
 *           ticketData:
*               - customer_name: Bussr user
*                 performance_title: Bussr test title
*                 ticket_price: 40
*                 performance_time: 24/05/2021 12:30
 *          
 *     responses:
 *       200:
 *         description: Successfully created
 *       401:
 *         description: Authorized error
 *       400:
 *         description: Invalid request/data
 *       500:
 *         description: Internal server error
 * 
 */
router.post('/createTickets', Users.auth, Tickets.createTickets, ErrorService.error);

// API to update  a single/many tickets.

/**
 * @swagger
 * /api/v1/tickets/updateTickets/{ticket_id}:
 *   post:
 *     tags:
 *       - updateTickets
 *     description: updates a single data.
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 * 
 *     parameters:
 *       - name: ticket_id
 *         desctiption: ticket id of ticket which needs to be updated.
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         
 *       - name: authorization
 *         description: Authorization header.
 *         in: header
 *         schema: 
 *           type: string
 *           format: uuid
 *         required: true
 * 
 *       - name: ticketUpdateData
 *         description:  json object having fields which needs to be updated.
 *         in: body
 *         required: true
 *         type : object
 *         properties:
 *           customer_name:
 *              type: string
 *           performance_title:
 *              type: string
 *           ticket_price:
 *              type: number
 *           performance_time:
 *              type: string
 *           
 *         example:
 *           ticketUpdateData:
*                 customer_name: Bussr user update
*                 performance_title: Bussr test title update
*                 ticket_price: 100
*                 performance_time: 24/05/2021 12:50
 *          
 *     responses:
 *       200:
 *         description: Successfully updated
 *       401:
 *         description: Authorized error
 *       400:
 *         description: Invalid request/data
 *       500:
 *         description: Internal server error
 * 
 */
router.post('/updateTickets/:ticket_id', Users.auth, Tickets.upodateTickets, ErrorService.error);

// API to delete single/many a tickets..
/**
 * @swagger
 * /api/v1/tickets/deleteTickets:
 *   post:
 *     tags:
 *       - deleteTickets
 *     description: delete a single/multiple data.
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 * 
 *     parameters:
 *       - name: authorization
 *         description: Authorization header.
 *         in: header
 *         schema: 
 *           type: string
 *           format: uuid
 *         required: true
 * 
 *       - name: deleteIds
 *         description:  array of string of tickets ids.
 *         in: body
 *         required: true
 *         type : object
 *         properties:
 *           deleteIds:
 *             type: array
 *             items:
 *              type: string
 *              example: 60abafdde2737031b43ce90d
 *              
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       401:
 *         description: Authorized error
 *       400:
 *         description: Invalid request/data
 *       500:
 *         description: Internal server error
 * 
 */
router.post('/deleteTickets', Users.auth, Tickets.deleteTickets, ErrorService.error);

export { router };