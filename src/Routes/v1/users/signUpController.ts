import express, { Router, Request, Response } from "express";
import { Users} from "../../../AuthService/users";
import { ErrorService } from '../../../ErrorService/error';

const router : Router = express.Router();

// API to register/create the account in app.

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     tags:
 *       - registerUser
 *     description: Register a user in system(account creation).
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 * 
 *     parameters:
 *       - name: userDetails
 *         description:  json object having fields user_name & pwd.
 *         in: body
 *         required: true
 *         type : object
 *         properties:
 *           user_name:
 *              type: string
 *           password:
 *              type: string
 *           
 *         example:
*              user_name: bussr
*              password: bussr123
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Invalid request/data
 *       500:
 *         description: Internal server error
 */
router.post('/register', Users.signUp, ErrorService.error);

export { router };


