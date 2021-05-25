import express, { Router, Request, Response } from "express";

import { constants } from '../Constants/constants';
import { IError } from '../Interfaces/IError';


// custom error class and error to send.
class ErrorService {
    static error(error : IError, req : Request, res : Response, next : Function) {

        // if the app is running in prod remove the stack trace.
        if(process.env.environemet == constants.environment)
            delete error.stack
        
        let errorData : IError = {
            status : error.status,
            message : error.message,
            stack : error.stack,
            data : error.data
        }
        console.log("Here ---- in error service ", errorData);
        res.status(error.status).json(errorData);
        return;
    }
}

export { ErrorService };
