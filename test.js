var request = require('request');


// let reqOpts = {
//     method : 'GET',
//     url : 'https://www.google.com',
//     //url : `${baseUrl}/api/v1/users/register`,
//     headers : {
//       'accept': 'application/json',
//       'Content-Type': 'application/json'
//     }
// }

let baseUrl  = `http://localhost:5000`;


let requestBody  = {
    "user_name": "bussr@test",
    "password": "bussr@123"
  }
  let reqOpts = {
      method : 'POST',
      body : JSON.stringify(requestBody),
      url : `${baseUrl}/api/v1/users/register`,
      headers : {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
  }

request(reqOpts, (err, res, body) => {

    console.log("Errror ", err);
    console.log("Body ", body);
    console.log("status ", res.statusCode);
})

