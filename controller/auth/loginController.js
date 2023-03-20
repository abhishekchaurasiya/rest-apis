import Joi from "joi";
import JwtServices from "../../service/JwtServices";
import { RefreshModel, UserModel } from "../../model";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import bcrypt from "bcrypt"
import { RFRESH_SECRET_KEY } from "../../config";


const loginController = {
    async login(req, res, next) {
        // validation 
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });

        const { error } = loginSchema.validate(req.body);
        if (error) {
            return next(error)
        };

        const { email, password } = req.body;
        try {
            const user = await UserModel.findOne({ email: email })
            if (!user) {
                return next(CustomErrorHandler.wrongCredential())
            }

            // compare the password 
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                return next(CustomErrorHandler.wrongCredential())
            }
            // access token generate 
            const access_token = JwtServices.sign({ _id: user._id, role: user.role });
            // Refresh token ka use karke apne access token ko strong kar skte hai
            const refresh_token = JwtServices.sign({ _id: user._id, role: user.role }, '1y', RFRESH_SECRET_KEY);

            //  database white list (means database me store karna)
            await RefreshModel.create({ token: refresh_token })

            res.json({ msg: "User hasbeen logged In", access_token, refresh_token })

        } catch (error) {
            return next(error)
        }
    },

};

export default loginController;