import { DEBUG_MODE } from "../config";
import { ValidationError } from 'joi'
import CustomErrorHandler from "../service/CustomErrorHandler";

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message;
    let data = {
        message: "Internal server error",
        // es type se error only developement time ke liye send kar skte hai but production ke time ke liye right nahi hoti hai 
        // if debug mode is true then orinal error send and data object ki property me merge ho jayegi 
        ...(DEBUG_MODE === 'true' && { orinalError: err.message })
    }

    // this error is our register schema ka instanceof hai
    if (err instanceof ValidationError) {
        // Here overwrite of statuscode 500 because here is validation error
        statusCode = 422,
            data = {
                // here origional message hi cliend ko send karte hai 
                message: err.message
            }
    };

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data: {
            message = err.message
        }
    };
    res.status(statusCode).json(data)
}


export default errorHandler;