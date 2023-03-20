import Joi from "joi";
import { RefreshModel } from "../../model";

const logoutController = {
    async logout(req, res, next) {
        // validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });

        const { error } = refreshSchema.validate(req.body);
        if (error) {
            return next(error)
        };

        try {
            await RefreshModel.deleteOne({ token: req.body.refresh_token })
        } catch (error) {
            return next(new Error("Something went to wrong in the database"))
        }
        res.json({ msg: "User logout" })
    }

};

export default logoutController;