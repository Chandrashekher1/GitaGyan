import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
function auth(req, res, next) {
    const token = req.header('Authorization'); // for authorization
    if (!token)
        return res.status(401).send("Access denied. No token provided.");
    try {
        const jwtPrivateKey = process.env.jwtPrivateKey;
        if (!jwtPrivateKey) {
            return res.status(500).send('JWT private key is not configured');
        }
        const decoded = jwt.verify(token, jwtPrivateKey);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(400).send('Invalid token.');
    }
}
export default auth;
//# sourceMappingURL=auth.middleware.js.map