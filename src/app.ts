import express, {Request, Response} from "express";
import * as bodyParser  from "body-parser";
const morgan = require('morgan');
import {users} from "./AuthService";
import {tickets} from './TicketsService';
import { analytics } from './AnalyticsService';
import {notFoundPage} from './Routes/notFound/404'
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


const app : any = express();

/*
    --------------------- SWAGGER -------------------
*/

const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()
app.use(express.static(pathToSwaggerUi))


const swaggerDefinition = {
    info: {
      title: 'Bussr APIs',
      swagger: "2.0",
      description: 'Bussr API test',
    },
    host: 'localhost:5000',
    basePath: '/',
};
  
  // options for the swagger docs
const options = {

    definition : {
        openapi : "3.0.0",
        info : {
            title : "swagger demo",
            version : "0.0.1",
            description : "Swagger"
        },

        servers : [
            {url : "http://localhost:5000"}
        ],
    },

    apis : ["./out/Routes/**/*.js"],

    swaggerDefinition : swaggerDefinition
    // // import swaggerDefinitions
    // swaggerDefinition: swaggerDefinition,
    // // path to the API docs
    // apis: ['./out/Routes/*.js'],
};
  
  // initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/swagger.json', function(req : Request, res : Response) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
    return;
});


app.use(morgan("dev"));

// parse application/x-www-form-urlencoded
let data: any = {
    limit: '500mb',
    parameterLimit: 1000000,
    // making this consistent with app server
    extended: true
};
app.use(bodyParser.urlencoded(data));

// parse application/json
app.use(bodyParser.json());

// Routes.
app.use('/api/v1/users', users);
app.use('/api/v1/tickets', tickets);
app.use('/api/v1/analytics', analytics);

// Handle 404 routes.
app.use(notFoundPage);

app.listen(5000, () => {
    console.log("Server running at port 5000");
});