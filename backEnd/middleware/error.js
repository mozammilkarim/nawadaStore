const errorHandler= require("../utils/errorHandler")
// for not found or internal error exceptions
module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.message=err.message|| "Internal Server Error"

    // for wrong mongodb Id error(cast error),less digigts in id params
    if (err.name==="CastError") {
        const message=`Resource not Found: ${err.path}`
        err=new errorHandler(404,message);
    }
    // for duplicate mongoose key error
    // like email
    if (err.code===1100) {
        const message=`Duplicate ${object.key(err.keyValue)} passed`
        err=new errorHandler(400,message);
    }
    // for wrong json web token error
    if (err.name==="JsonWebTokenError") {
        const message=`Json web token is Invalid, Try again`
        err=new errorHandler(400,message);
    }
    // for wrong json web token expiry error
    if (err.name==="JsonWebTokenError") {
        const message=`Json web token Expired, Try again`
        err=new errorHandler(400,message);
    }
    res.status(err.statusCode).send({
        success:false,
        message:err.message
    })
}