# Bussr Test

## Componenet Covered
`````````
1. All the curd APIs for ticket model
      - Create/issue a ticket
      - update a ticket
      - delete a ticket
       
2. All the analytics
     - profi analytics
     - user visit analytics
     
 3. A nice swagger UI, with all the details in example. (http://localhost:5000/api-docs/)
     json format of all APIs available here - http://localhost:5000/swagger.json
 
 4. Mocha & Chai testing framework added
     - ticket create API test added
     - ticket update API test added
     - ticket delete API test added
     - register user API test added
     
 Note - Could not add the dockerization in app due to time limit. (make sure to run the app locally and test it from swgger APIs)
`````````

## Getting Started

The project is writeen in Typescript. So make sure typescript is installed in your system globally.

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

1. Node.js & MongoDB & typescript should be installed and make sure the mongo db is running on default port. my db connection is being made to deafult port so
   make sure that mongodb is running on default port & host (localhost:27017).

### Installing

A step by step series of examples that tell you have to get a development env running


```
1. npm install --save
2. npm install --save-dev
```

Compile the typescript to javascript. Run below command.
Below command will compile the typescript into js(in `out` folder) and it will also run the test cases (Mocha & chai test cases.)
Below command will automatically start the server so no need to start the server again explicitly.

```
2. npm run build
```

---------------------------------------------------------------------------------
After `npm run build` cmd. Make sure that you get a console meessage of "Server is running at port 5000". It will come after cases logs.

Once app is up and running. Go to swagger API documentation.
Below is the url of swagger UI.

The below API will open the swagger UI interface with all the details mentioned in all the APIs. 
Click on any API and click on the option `Try it out` button.
I have mentioned all the required paramenters and request body format in example. 
Take a look and edit the given fields and hit `execute` button.

````````````````
Go to url : http://localhost:5000/api-docs/

Step 1 - First genereate the auth key to use any API to generate auth key you have to use the API - 

`registerUser` from the swagger API documentation. Check the last API in the APIs list on swagger UI.

OR use curl - 

curl -X 'POST' \
  'http://localhost:5000/api/v1/users/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "user_name": "bussr", // paas your user_name
  "password": "bussr123" // paas your pwd
}'

With the above register API you will receive the "token" which you will have to pass in header of other APIs
Note - Token is valid for 2 hours only. If you a token which is expired you will receive the "token expired error" from other APIs


Step 2 - 
Once you get the toke paas this token in other API's header to access them.