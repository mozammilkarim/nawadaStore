const mongoose=require("mongoose")
// validator module is used for validating emails
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Name length can't be more than 30"],
        minLength:[4,"Name length can't be less than 4"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Email is invalid"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[8,"Password length can't be less than 8"],
        // except password everything will be returned on query
        select:false
    },
    avatar:{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    
    resetPasswordToken:String,
    resetPasswordExpiry:Date
})
// to encrypt password, ,save is an event 
// in arrow function , this keyword cannot be used
userSchema.pre("save",async function(next){
    if (!(this.isModified("password"))) {
        next();
    }
    // here 10 is salt(kind of strength) for hash
    this.password=await bcrypt.hash(this.password,10)
})
// jwt token
userSchema.methods.getJWTToken=function(){
    // takes userID(_id from db and secret key)
    return jwt.sign({id:this._id},process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRE});
}
// for comparing password
userSchema.methods.comparePassword=async function(enteredPassword){
    console.log(enteredPassword,this.password,"in compare pass ")
    return await bcrypt.compare(enteredPassword,this.password);
}

// generating token for resetting passwords
userSchema.methods.generateResetTokens=function() {
    // genearate token by getting random 20 bytes string 
    const resetToken=crypto.randomBytes(20).toString("hex")
    // hashing and adding reset password token
    this.resetPasswordToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
    this.resetTokenExpire=Date.now()+15*60*1000;
    // sending only random generated token
    return resetToken;
}


module.exports= mongoose.model("User",userSchema);