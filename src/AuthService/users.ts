const jwt = require('jsonwebtoken');
import express, {Router, Request, Response } from "express";
import { IError } from '../Interfaces/IError';
import { constants } from '../Constants/constants';

class Users {

    static signUp(req : Request, res : Response, next : Function) {

        //generate the json web token.
        let body : any = req.body;

        if(!body || !Object.keys(body).length || !req.body.user_name || !req.body.password) {
            let error : IError = {status : 400, message : "Provide userName & pwd"};
            return next(error);
        }

        let userName: string = req.body.user_name;
        let password: string = req.body.password;

        let data: string = userName + '_' + password;
        let token: any = jwt.sign({ data: data }, constants.jwtToken, { expiresIn: '2h' });
        res.json({ err: false, result: { message: 'Please use this token for subsequent request', token: token } });
        return;
    }

    static auth(req : any, res : Response, next : Function) {
        // verify the jwt token here.
        if (!req || !req.body || !req.headers || !req.headers.authorization) {
            let error : IError = {status : 400, message : "Missing required info/data"};
            return next(error);
        }

        let jwtToken: string = req.headers.authorization;
        let user: any = null;
        try {
            user = jwt.verify(jwtToken, constants.jwtToken);
            // set the user info on request so we can access it in other middleware
            req.user_id = user && user.data && user.data.toString(); 
            return next();
        } catch (err) {

            if(err.name === constants.TokenExpiredError) {
                let error : IError = {status : 401, message : "Token expired please referesh token"};
                return next(error);
            }
            let error : IError = {status : 401, message : "Invalid token. Provide the correct token"};
            return next(error);
        }
    }
}

export { Users };