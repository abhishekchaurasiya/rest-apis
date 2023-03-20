import { UserModel } from "../../model";
import CustomErrorHandler from "../../service/CustomErrorHandler";

// This controller get the current user info 
const userController = {
    async me(req, res, next) {
        try {
            // req.user._id ko with user ke access ke after data get karne nahi dena hai 
            const user = await UserModel.findOne({ _id: req.user._id }).select({ password: 0, updatedAt: 0, __v: 0 });
            if (!user) {
                return next(CustomErrorHandler.notFound())
            }
            res.json(user);

        } catch (error) {
            return next(error)
        }
    }
}


export default userController;