let envs : string[] = ['production', 'staging'];

export let constants = {
   environment : 'production',
   jwtToken : process.env.jwtToken || "@#NSKJSK65789mnbvc&*()",
   TokenExpiredError : "TokenExpiredError",
   dbName : 'Bussr'
}