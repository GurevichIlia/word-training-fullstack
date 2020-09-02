import multer from 'multer'
import { NextFunction } from 'express';


export const uploadCsv = () => {
      return multer({ dest: "./uploads/" }).single("csvFile"), function (req: Request, res: Response, next: NextFunction) {
            req;
            console.log(req)
            next()
      }
}

