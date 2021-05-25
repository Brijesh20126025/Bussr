export interface IError {
    status : number
    message : string | undefined;
    stack? : any;
    data? : any;
}