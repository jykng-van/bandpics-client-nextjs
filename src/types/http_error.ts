export class HttpError extends Error{
    statusCode: number;
    data: object | undefined;
    constructor(message:string, statusCode:number, data?:object){
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.data = data;

        Object.setPrototypeOf(this, HttpError.prototype);
    }
}