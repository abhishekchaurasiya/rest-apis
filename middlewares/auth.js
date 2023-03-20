import CustomErrorHandler from "../service/CustomErrorHandler";
import JwtServices from "../service/JwtServices";

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized())
    };
    const token = authHeader.split(" ")[1];  // req token se headers ko parse kar dete hai 

    try {
        const { _id, role } = await JwtServices.verify(token);
        const user = { _id, role }
        req.user = user;

        // This is same type of user value
        // req.user = {};
        // req.user._id = user._id;
        // req.user.role = user.role
        next() // This is not an error only this is a middleware 

    } catch (error) {
        return next(CustomErrorHandler.unAuthorized())
    }


};

export default auth;