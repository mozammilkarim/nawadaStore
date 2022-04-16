import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";


export const addToCartItems = createAsyncThunk("productDetail/cartItem",
    // after running async call , it will give te return to dispatch
    async (argument) => {
        const { id, quantity }=argument
        console.log(quantity,id)
        // get response from backend
        const response = await axios
            .get(`/api/v1/product/${id}`)
            .catch((err) => {
                console.log(err)
            })
        // store product details
        const product = response.data.product
        const data = {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0].url,
            stock: product.stock,
            quantity: quantity
        }
        // console.log(data)
        // localStorage.setItem("cartItems",JSON.stringify(useSelector(getCartDetail)))
        return (data)
    }
)

const cartSlice = createSlice({
    name: "cartDetail",//name of slice
    initialState: {
        cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) :[],
        shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) :[]
        // 
    },
    reducers: {
        // attaching actions with reducers
        addToLocalStorage: (state) => {
            // store locally on machine
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
            // console.log(localStorage.getItem("cartItems"),state.cartItems)
        },
        removeCartItem:(state,{payload})=>{
            console.log(payload)
            // do not include removed item in cartItems
            return {
                ...state,
                cartItems: state.cartItems.filter((i) => i.product !== payload),
              };
        },
        saveShippingInfo: (state,{payload}) => {
            // store locally on machine
            // console.log(payload)
            localStorage.setItem("shippingInfo", JSON.stringify(payload))
        },

    },
    // for asynchronous action 
    extraReducers: {
        [addToCartItems.pending]: () => {
            console.log("pending")
        },
        [addToCartItems.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled\n", payload)
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            const item = payload;
            // find if product already exists,don't add it to cart
            const isItemExist = (state.cartItems).find(
                (i) => i.product === item.product
            );
            if (isItemExist) {
                // storing single copy of each product
                // stopping repeatition
                return {
                  ...state,
                  cartItems: state.cartItems.map((i) =>
                    i.product === isItemExist.product ? item : i
                  ),
                };
              } else {
                return {
                  ...state,
                  cartItems: [...state.cartItems, item],
                };
              }

        },
        [addToCartItems.rejected]: () => {
            console.log('rejected')
        },
    }

})

export default cartSlice.reducer
export const getCartDetail = (state) => state.cart
// export const getShippingInfo = (state) => state.cart.shippingInfo

// to use regular action of reducer
export const { addToLocalStorage,removeCartItem ,saveShippingInfo} = cartSlice.actions