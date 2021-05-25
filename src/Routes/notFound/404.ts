import express, { Router, Request, Response } from "express";

const router : Router = express.Router();

export function notFoundPage(req : Request, res : Response, next : Function) {
    res.status(404).send("Page Not found");
    return;
}