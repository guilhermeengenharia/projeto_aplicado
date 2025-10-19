import { Request, Response} from 'express';

export const ResponseStatus = async (res: Response, code: any, data: any,total:any) => {
    let type = "Success";
    let message = '';
    let response = { resCode: code, type: type, message: message,totalRow:total,data:data }
    res.send(response);
};