const mongoose = require('mongoose');

class DbService {
    static connectSync(dbName : string) {

        return new Promise<{err : any, connection : any}>((resolve, reject) => {

            const options = __getDbOptions();
            mongoose.connect(__getConnectionString(dbName), options);
            const db = mongoose.connection;

            db.on('error', (err : any) => {
                console.error("#Db Connection error ", err);
                return resolve({err : err, connection : null});
            });
            db.on('open', (err : any) => {
                // we're connected!
                console.log("We are now connected to db " + dbName);
               // console.log("### Worker connection ", db);

                // cache the connection. (if need it else ignore)
                process.env.dbConn = db;
                return resolve({err : err, connection : db});
            });

            db.on('close', () => {
                console.info("#Db connection closed " + dbName);
            });
        })
    }

    static connectAsync(dbName : string, callback : Function) {
        const options = __getDbOptions();
        mongoose.connect(__getConnectionString(dbName), options);
        const db = mongoose.connection;

        db.on('error', (err : any) => {
            console.error("#Db Connection error ", err);
            return callback(err, db);
        });
        db.on('open', (err : any) => {
            // we're connected!
            console.log("We are now connected to db " + dbName);
            console.log("### Worker connection ", db);

            // cache the connection.
            process.env.dbConn = db;
            return callback(err, db);
        });

        db.on('close', () => {
            console.info("#Db connection closed " + dbName);
            db.close();
        });
    }
}

function __getConnectionString(dbName : string) : string {
    let connectionString : string  = `mongodb://localhost/${dbName}`;
    return connectionString;
}

function __getDbOptions() {
    return {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false, // Don't build indexes
        poolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
    };
}

export { DbService };