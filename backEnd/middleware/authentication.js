const jwt = require("jsonwebtoken");
// importing collection name
const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require("./asyncError")
exports.isAuthenticatedUser=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    console.log(req.body.name,req.user)
    if (!token) {
        return next(new ErrorHandler(401,"Please login to access the resources"))
    }
    // to find  the id of user from cookies stored  
    const decodedData=jwt.verify(token,process.env.JWT_SECRET);
    // get user'S id stored in his cookie for future use 
    console.log(decodedData.id)
    req.user=await User.findById(decodedData.id)
    console.log(req.body.name,req.user)
    next();
})
// by default js, sends all objects by refrence
// pass by copy is used to use it as array
exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        // if user is accessing the resource by a different role than
        // its original assigned role
        if (!roles.includes(req.user.role)) {
            return next( new ErrorHandler(403,
                `Resource restricted for Role:${req.user.role}`)
            )
        }
        next();
    }
}