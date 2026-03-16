import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
declare function auth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export default auth;
//# sourceMappingURL=auth.middleware.d.ts.map