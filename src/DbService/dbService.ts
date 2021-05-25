class DatabaseService {

     static insertManySync(db : any, collectionName: string, doc: any[]) {
        return new Promise<{ err: any, result: any }>((resolve, reject) => {
    
            if(errorCheck(db)) {
                return resolve({err : 'db instance is not valid', result : null});
            }
            
            // handling the exception explicitly
            // but in real senario clients needs to handle at their end.
            try { 
                db.collection(collectionName).insertMany(doc, function (err : any, result : any) {
                    db.close();
                    return resolve({ err, result });
                });
            }
            catch(ex : any) {
                console.error('### DB error ' + collectionName);
                return resolve({err : ex, result : null});
            }
        });
    }
    
    static updateOneWithOptions(db : any, collectionName: string, filter : any, doc: any, options : any = {}) {
        return new Promise<{ err: any, result: any }>((resolve, reject) => {
    
            if(errorCheck(db)) {
                return resolve({err : 'db instance is not valid', result : null});
            }
            
            try {
                db.collection(collectionName).updateOne(filter, doc, function (err : any, result : any) {
                    db.close();
                    return resolve({ err, result });
                });
            }
            catch(ex : any) {
                console.error('### DB error ' + collectionName);
                return resolve({err : ex, result : null});
            }
        });
    }
    
    static deleteManyWithOptions(db : any, collectionName: string, query: any, options : any = {}) {
    
        return new Promise<{ err: any, result: any }>((resolve, reject) => {
    
            if(errorCheck(db)) {
                return resolve({err : 'db instance is not valid', result : null});
            }
            
            try {
                db.collection(collectionName).deleteMany(query, options, function (err : any, result : any) {
                    db.close();
                    return resolve({ err, result });
                });
            }
            catch(ex : any) {
                console.error('### DB error ' + collectionName);
                return resolve({err : ex, result : null});
            }
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