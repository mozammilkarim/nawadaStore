const catchAsyncError = require("../middleware/asyncError")
const ErrorHandler = require("../utils/errorHandler");
const Users = require("../model/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js")
const crypto=require("crypto");
const { findByIdAndUpdate } = require("../model/userModel");
const cloudinary = require("cloudinary");
// register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    
    console.log(req.body.avatar,"from register")
    // upload file to cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
    //   image passed should be in kbs
    const { name, email, password } = req.body
    const user = await Users.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    })
    // should duplicate key error here
    console.log("user created")
    // call the token
    sendToken(user, 201, res)
})
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    // checking for empty data
    if (!email || !password) {
        return next(new ErrorHandler(400, "Please enter Email & Password "))
    }
    const user = await Users.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler(401, "User Not found"))
    }
    const isPasswordMatched = await user.comparePassword(password)
    console.log(isPasswordMatched,password,user.password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler(401, "Password Not Matched"))
    }
    
    // call the token
    sendToken(user, 200, res)
})
// logout user
exports.logOutUser = catchAsyncError(async (req, res, next) => {
    // made secret key to be null and token to expire
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})
// forgot password
exports.forgotPass = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    // findOne is not working
    console.log(email)
    const user = await Users.findOne({ email });
    // const user=await Users.findById("6244977fe20d6c2302c236ee");

    if (!user) {
        return next(new ErrorHandler(404, "Sorry,User not Found"))
    }
    // generate reset Token
    const resetToken = user.generateResetTokens();

    // to save the new variables of user genearated on resetToken
    await user.save({ validateBeforeSave: false })
    // now preparing for nodemailer
    // https://localhost/api/...
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    // temporarily changing host for running frontend and backend at diferrent ports
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

    const message = `Your reset Password Token is generated at\n\n${resetPasswordUrl}
    \n\nIf you have not requested then ,please ignore it`

    try {
        // for sending email to reset passwords
        //error here
        await sendEmail({
            email: user.email,
            subject: "DiscountQueen Password Recovery",
            message
        })

    } catch (error) {
        // we have to change the user variables 
        // set at time of token generation and save them because 
        // mail is not sent,error occured

        user.resetPasswordToken = undefined
        user.resetTokenExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(500, error.message))
    }
})
// for reseting password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // hashing the token got from url given in forgot pass
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    // finding the user having the above token, by matching the hashed token
    // token should not have expired   
    const user = await Users.findOne({
        resetPasswordToken,
        resetTokenExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler(400, "password token is invalid"))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler(400, "password does not matches with confirm password"))
    }
    // reseting password and token variables
    user.password = req.body.password;
    user.resetPasswordToken = undefined
    user.resetTokenExpire = undefined
    await user.save({ validateBeforeSave: false })
    // for again logging in
    sendToken(user, 200, res)
})


// for displaying user details to user
exports.displayUser=catchAsyncError(async(req,res,next)=>{
    //because we stored user details at time of login in cookies 
    const user=await Users.findById(req.user.id);
    
    res.status(200).json({
        success:true,
        user
    })
})
// for updating password
exports.updatePassword= catchAsyncError(async(req,res,next)=>{
    // already logged in user will update his password
    const user=await Users.findById(req.user.id).select("+password");
    // if password provided matches with original password
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler(400,"old Password is invalid"))
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler(400, "password does not matches with confirm password"))
    }
    user.password=req.body.newPassword;
    await user.save();

    res.status(200).json({
        success:true,
        user
    })
})
// for updating profile except password , for already logged in user
exports.updateUser= catchAsyncError(async(req,res,next)=>{
    console.log(req.body.name,req.body.avatar)
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }
    console.log(newUserData)
    if (req.body.avatar !== "") {
        const user = await Users.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    
    // // we will add avatar later
    const user=await Users.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    

    res.status(200).json({
        success:true,
        user
    })
    // res.status(200).json({
    //     message:"working"
    // })
})

// get all user details for admin
exports.getAllUsers=catchAsyncError(async(req,res,next)=>{
    const users=await Users.find();
    res.status(200).json({
        success:true,
        users
    })
})
// get single user details for admin
exports.getUser=catchAsyncError(async(req,res,next)=>{
    const user=await Users.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(400,
            `User does not exist with ${req.params.id}`))
    }
    res.status(200).json({
        success:true,
        user
    })
})
// for updating profile by admin
exports.updateProfile= catchAsyncError(async(req,res,next)=>{
    // update user details
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user=await Users.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    if(!user){
        return next(new ErrorHandler(400,
            `User does not exist with ${req.params.id}`))
    }
    res.status(200).json({
        success:true,
    })
})
// for deleting profile by admin
exports.deleteProfile= catchAsyncError(async(req,res,next)=>{
    
    // we will delete avatar later
    const user=await Users.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(400,
            `User deleted successfully`))
    }
    await user.remove();
    res.status(200).json({
        success:true,
        user
    })
})