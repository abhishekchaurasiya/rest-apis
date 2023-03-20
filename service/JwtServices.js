import { JWT_SECRET_KEY } from "../config";
import jwt from 'jsonwebtoken'

class JwtServices {
    static sign(payload, expiry = "60m", secret = JWT_SECRET_KEY) {
        return jwt.sign(payload, secret, { expiresIn: expiry })
    }

    static verify(token, secret = JWT_SECRET_KEY) {
        return jwt.verify(token, secret)
    }

};

export default JwtServices;