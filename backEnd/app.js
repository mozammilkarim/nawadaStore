const express =require("express")
const app=express();
const cookieParser=require("cookie-parser")
const bodyParser = require('body-parser')
const fileUpload=require("express-fileupload")

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
const dotenv=require("dotenv")
const error=require("./middleware/error")
const path=require("path")
// config
if (process.env.NODE.ENV!=="PRODUCTION") {
    // we need to include this only to run on localhost
    const dotenv=require("dotenv")
    dotenv.config({path:"backend/config/config.env"})
}

// import  route
const product=require("./routes/productRoute")
const user=require("./routes/userRoute")
const order=require("./routes/orderRoute")
const payment=require("./routes/paymentRoute")
app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)
app.use("/api/v1",payment)

// to connect frontend and backend at same port
app.use(express.static(path.join(__dirname,"../frontend/build")))
// serve all requests to same files ,i.e,frontend react file
// as all files of react are included in a single file  
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/build/index.html"))
})
// callng error middleware function
app.use(error)
module.exports=app;