import {Request, Response, NextFunction} from 'express';

export function LogRequestBody(req: Request, res: Response, next: NextFunction) {
  console.log('Request body: ', req.body);
  next();
}
