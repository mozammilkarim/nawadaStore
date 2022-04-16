const app=require("./app")
const path = require("path")
const cloudinary=require("cloudinary")
// config
if (process.env.NODE.ENV!=="PRODUCTION") {
    // we need to include this only to run on localhost
    const dotenv=require("dotenv")
    dotenv.config({path:"backend/config/config.env"})
}
const databaseConnect=require("./config/dbConnection")
// handling uncaught exception, undefined vaiables used(example)
process.on("uncaughtException",(err)=>{
    console.log("Server shutting down due to uncaught error")
    console.log(err)
    process.exit(1)
})
// console.log(youTube) 
// calling database connection function
databaseConnect();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API,
    api_secret:process.env.CLOUDINARY_API_SECRET    ,
})
console.log(process.env.CLOUDINARY_API ," from server.js")

const server=app.listen(process.env.PORT,()=>{
    console.log("listening on",process.env.PORT)
})
// unhandled promise rejection, like wrong url in database server 
// connection on database connection error
process.on("unhandledRejection",(err)=>{
    console.log("error,",err)
    console.log("server shutting down due to unhandled promise rejection")
    server.close(()=>{
        process.exit(1);
    })
})