import { Request, Response} from 'express';

export const ResponseStatus = async (res: Response, code: any, data: any,message:any) => {
    let type = "Success";
    let response = { resCode: code, type: type, message: message,data:data }
    res.send(response);
};