import {Request, Response, NextFunction} from 'express';

export function IsAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return res.status(403).json({error: 'You are not logged in!'});
  }
  next();
}
