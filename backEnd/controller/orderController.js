const Order=require("../model/orderModel")
const Products=require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require("../middleware/asyncError")
// function for making an order
exports.newOrder=catchAsyncError(async(req,res,next)=>{
    // console.log(req.body.shippingInfo)
    const { 
        shippingInfo,orderItems,PaymentInfo,itemPrice,
        taxPrice,totalPrice,shippingPrice
    }=req.body
    console.log("hi",shippingInfo,orderItems,PaymentInfo,itemPrice,
        taxPrice,totalPrice,shippingPrice)
    const order=await Order.create({
        shippingInfo,
        orderItems,
        PaymentInfo,
        itemPrice,
        taxPrice,
        totalPrice,
        shippingPrice,
        paidAt:Date.now(),
        user:req.user._id
    })
    res.status(200).json({
        success:true,
        order
    })
})
// get single order
exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{
    // simply grab user details of order using 'user' attribute 
    // of order document by going into Users collection
    // and grab only name , email  from that document
    const order=await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )
    if (!order) {
        return next(new ErrorHandler(404,"Order Does not exist"))
    }
    res.status(200).json({
        success:true,
        order
    })
})
// get my order for logged in users
exports.myOrders=catchAsyncError(async(req,res,next)=>{
    // simply grab user details of order 
    // of logged in user
    const orders=await Order.find({user:req.user._id})
    
    res.status(200).json({
        success:true,
        orders
    })
})
// get all orders for admin
exports.getAllOrders=catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find()
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        orders,totalAmount
    })
})
async function updateStock(productId,quantity){
    const product=await Products.findById(productId)
    product.stock-=quantity;
    await product.save({validateBeforeSave:false})
}
// update order status by admin
exports.updateOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler(404,"Order Does not exist"))
    }
    order.orderStatus=req.body.status

    if (order.orderStatus==="Delivered") {
        return next(new ErrorHandler(404,"Order Already delivered"))
    }
    // only change the order quantity when you are shipping
    // preventing further change in delivered status
    if (order.orderStatus==="Shipped") {
        order.orderItems.forEach(async(order)=>{
            console.log(order.product,order.quantity,"from backend")
            await updateStock(order.product,order.quantity)
        })
    }
    
    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        order
    })
})

// delete order by admin
exports.deleteOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler(404,"Order Does not exist"))
    }
    
    await order.remove()
    res.status(200).json({
        success:true
    })
})
