import { NextFunction, Request, Response } from 'express';
import xss from 'xss';
const xssClean = (req: Request, res: Response, next: NextFunction) => {
  const sanitize: any = (data: any) => {
    if (Array.isArray(data)) {
      return data.map((item) => sanitize(item));
    } else if (typeof data === 'object' && data !== null) {
      const sanitizedObj: any = {};
      for (const key in data) {
        sanitizedObj[key] = sanitize(data[key]);
      }
      return sanitizedObj;
    } else if (typeof data === 'string') {
      return xss(data);
    } else {
      return data;
    }
  };
  if (req.body && typeof req.body === 'object') {
    req.body = sanitize(req.body);
  }
  next();
};

export default xssClean;
