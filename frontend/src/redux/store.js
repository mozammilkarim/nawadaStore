import {configureStore} from "@reduxjs/toolkit"
import productReducer from "./productSlice.js"
import  productDetailReducer from "./productDetailSlice"
import userReducer from "./userSlice.js"
import updateProfileReducer from "./updateProfileSlice.js"
import resetPasswordReducer from "./resetPasswordSlice.js"
import cartDetailReducer from "./cartSlice.js"
import orderDetailReducer from "./orderSlice.js"

export const store=configureStore({
    reducer:{
        // products is name of reducer
        productDetail:productDetailReducer ,
        products:productReducer ,
        user:userReducer,
        updateProfile:updateProfileReducer,
        resetPassword:resetPasswordReducer,
        cart:cartDetailReducer,
        orders:orderDetailReducer
    }  
})