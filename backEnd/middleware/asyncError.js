// didn't understand--> try catch error
// first tries to resolves the function and if not possible catches the error
module.exports=theFunc =>(req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next)
}