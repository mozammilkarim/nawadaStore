// to generate token and store  cookie
// why environment variables are available in this module
// env variables are declared in server.js and 
// could be used all over the modules
const sendToken=(user,statusCode,res)=>{
    // call the token
    const Token=user.getJWTToken()
    // for cookie
    const options={
        expires:new Date(
            Date.now()+ process.env.COOKIE_EXPIRE *24*60*60*1000
        ),httpOnly:true
    }
    res.status(statusCode).cookie("token",Token,options).json({
        success:true,user,Token
    })
}
module.exports=sendToken