import Joi from "joi";
import { RFRESH_SECRET_KEY } from "../../config";
import { RefreshModel, UserModel } from "../../model";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import JwtServices from "../../service/JwtServices";

const refreshController = {
    async refreshToken(req, res, next) {
        // validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });

        const { error } = refreshSchema.validate(req.body);
        if (error) {
            return next(error)
        };

        // Check if is present refresh token in database then issued the new access token 
        let refreshToken;
        try {
            refreshToken = await RefreshModel.findOne({ token: req.body.refresh_token });
            if (!refreshToken) {
                return next(CustomErrorHandler.unAuthorized("Invaild refrsh token"))
            }
            // here refresh token is present then verify to the refresh token
            let userid;
            try {
                const { _id } = await JwtServices.verify(refreshToken.token, RFRESH_SECRET_KEY)
                userid = _id;
            } catch (error) {
                return next(CustomErrorHandler.unAuthorized("Invaild refrsh token"))
            }

            const user = await UserModel.findOne({ _id: userid });
            if (!user) {
                return next(CustomErrorHandler.unAuthorized("No user found"))
            }

            // Generate here new access and refresh token 
            const access_token = JwtServices.sign({ _id: user._id, role: user.role });
            const refresh_token = JwtServices.sign({ _id: user._id, role: user.role }, '1y', RFRESH_SECRET_KEY);

            //  database white list (means database me store karna)
            await RefreshModel.create({ token: refresh_token })

            res.json({ msg: "User hasbeen logged In", access_token, refresh_token })

        } catch (error) {
            return next(new Error("Someting went worng", err.message))
        }
        
    }
}

export default refreshController;