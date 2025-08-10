import { constants } from '../constants';
const errorHandler = (err, req, res, next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch(statusCode){
        case constants.VALIDATION_ERROR:
            res.json({
                title: "Validation Failed",
                message: err.message,
                stackTrace: err.stack
            });
        case constants.UNAUTHORIZED:
            res.json({
                title: "Unauthorised Access",
                message: err.message,
                stackTrace: err.stack
            });
        case constants.FORBIDDEN:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrace: err.stack
            });
        case constants.NOT_FOUND:
            res.json({
                title: "Not Found",
                message: err.message,
                stackTrace: err.stack
            });
        case constants.SERVER_ERROR:
            res.json({
                title: "Server Error",
                message: err.message,
                stackTrace: err.stack
            });
        default:
            console.log("No error handler found for this error");
            break;    
    }
    //title because we are going to have various types of errors
    res.json({ title:"Not Found", message : err.message,stackTrace: err.stack});
    res.json({ title:"Validation Failed", message : err.message,stackTrace: err.stack});
};

export default errorHandler;