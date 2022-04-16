const mongoose=require("mongoose")
const databaseConnect=()=>{
    mongoose.connect(process.env.DB_URI,{
        useNewUrlParser:true,useUnifiedTopology:true
    }).then((data)=>{
        console.log(`db connected successfully ${data.connection.host}`)
    })   
}
module.exports=databaseConnect