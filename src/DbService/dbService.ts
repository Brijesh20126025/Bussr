export function insertManySync(db : any, collectionName: string, doc: any[]) {
    return new Promise<{ err: any, result: any }>((resolve, reject) => {

        if(errorCheck(db)) {
            return resolve({err : 'db instance is not valid', result : null});
        }

        db.collection(collectionName).insertMany(doc, function (err : any, result : any) {
            return resolve({ err, result });
        });
    });
}

export function updateOneWithOptions(db : any, collectionName: string, filter : any, doc: any, options : any = {}) {
    return new Promise<{ err: any, result: any }>((resolve, reject) => {

        if(errorCheck(db)) {
            return resolve({err : 'db instance is not valid', result : null});
        }

        db.collection(collectionName).updateOne(filter, doc, function (err : any, result : any) {
            return resolve({ err, result });
        });
    });
}

export function deleteManyWithOptions(db : any, collectionName: string, query: any, options : any = {}) {

    return new Promise<{ err: any, result: any }>((resolve, reject) => {

        if(errorCheck(db)) {
            return resolve({err : 'db instance is not valid', result : null});
        }

        db.collection(collectionName).deleteMany(query, options, function (err : any, result : any) {
            return resolve({ err, result });
        });
    });
}


function errorCheck(db : any) : Boolean {
    if(!db) {
        console.error("### DB handle is null");
        return true;
    }
    return false;
}