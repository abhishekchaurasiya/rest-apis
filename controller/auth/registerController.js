import Joi from "joi";
import { RefreshModel, UserModel } from "../../model";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtServices from "../../service/JwtServices";
import { RFRESH_SECRET_KEY } from "../../config";

const registerController = {
    async register(req, res, next) {

        // Validation 
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(35).required(),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref("password")
        });

        // error handle of body
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(error)
        }

        const { name, email, password } = req.body;
        // check if user is in the database already present
        try {
            const exist = await UserModel.exists({ email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist("This email is already taken."))
            }
        } catch (error) {
            return next(error)
        };

        // Hashing password
        const hashPassword = await bcrypt.hash(password, 10);

        // prepare the model
        const user = new UserModel({
            name,
            email,
            password: hashPassword
        });

        let access_token;
        let refresh_token;
        try {
            const result = await user.save();
            access_token = JwtServices.sign({ _id: result._id, role: result.role });
            refresh_token = JwtServices.sign({ _id: result._id, role: result.role }, '1y', RFRESH_SECRET_KEY);

            //  database white list (means database me store karna)
            await RefreshModel.create({ token: refresh_token })

        } catch (error) {
            return next(error)
        }

        res.json({ access_token, refresh_token, user: user })
    }
}

export default registerController;