import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
import { Request, Response, NextFunction } from 'express'

dotenv.config()
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization') // for authorization
    if(!token) return res.status(401).send("Access denied. No token provided.")
    try{
        const jwtPrivateKey = process.env.jwtPrivateKey;
        if (!jwtPrivateKey) {
            return res.status(500).send('JWT private key is not configured');
        }
        const decoded = jwt.verify(token, jwtPrivateKey)
        req.user = decoded
        next()
    }
    catch(err){
        res.status(400).send('Invalid token.')
    }
}
export default auth