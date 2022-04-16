const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Product description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product price"],
        maxLength: [8, "Cannot exceed 8 characters"]
    },
    ratings: {
        type: Number,
        default: 8
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "Please Enter Product category"]
    },
    stock: {
        type: Number,
        required: [true, "Please Enter Product stock"],
        maxLength: [4, "Cannot exceed 4 characters"],
        default:1
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required:true,
                default: 5
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],
    // for storing who created the product
    // take the id from User collection
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }
    ,
    createdAt:{
        type:String,
        default:Date.now
    }

})
module.exports=mongoose.model("Product",productSchema);