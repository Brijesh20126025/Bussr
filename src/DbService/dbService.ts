class DatabaseService {

     static insertManySync(db : any, collectionName: string, doc: any[]) {
        return new Promise<{ err: any, result: any }>((resolve, reject) => {
    
            if(errorCheck(db)) {
                return resolve({err : 'db instance is not valid', result : null});
            }
    
            db.collection(collectionName).insertMany(doc, function (err : any, result : any) {
                db.close();
                return resolve({ err, result });
            });
        });
    }
    
    static updateOneWithOptions(db : any, collectionName: string, filter : any, doc: any, options : any = {}) {
        return new Promise<{ err: any, result: any }>((resolve, reject) => {
    
            if(errorCheck(db)) {
                return resolve({err : 'db instance is not valid', result : null});
            }
    
            db.collection(collectionName).updateOne(filter, doc, function (err : any, result : any) {
                db.close();
                return resolve({ err, result });
            });
        });
    }
    
    static deleteManyWithOptions(db : any, collectionName: string, query: any, options : any = {}) {
    
        return new Promise<{ err: any, result: any }>((resolve, reject) => {
    
            if(errorCheck(db)) {
                return resolve({err : 'db instance is not valid', result : null});
            }
    
            db.collection(collectionName).deleteMany(query, options, function (err : any, result : any) {
                db.close();
                return resolve({ err, result });
            });
        });
    }

    static aggregationWithOptions(db : any, collectionName : string, query : any[], options : any = {}) {

        return new Promise<{err : any, result : any[]}>((resolve ,reject) => {
            if(errorCheck(db)) {
                return resolve({err : 'db instance is not valid', result : []});
            }
            db.collection(collectionName).aggregate(query, options).toArray().then((dbres : any) => {
                db.close();
                return resolve({err : null, result : dbres});
                
            }).catch((dberr : any) => {
                db.close();
                return resolve({err : dberr, result : []});
            });
        });
    }

    static findManyWithOptions(db : any, collectionName : string, query : any, options : any = {}) {
        return new Promise<{err : any, result : any[]}>((resolve ,reject) => {
            if(errorCheck(db)) {
                return resolve({err : 'db instance is not valid', result : []});
            }
            db.collection(collectionName).find(query, options).toArray().then((dbres : any) => {
                db.close();
                return resolve({err : null, result : dbres});
                   
            }).catch((dberr : any) => {
                db.close();
                return resolve({err : dberr, result : []});
            });
        });
    }
}


function errorCheck(db : any) : Boolean {
    if(!db) {
        console.error("### DB handle is null");
        return true;
    }
    return false;
}

export { DatabaseService };