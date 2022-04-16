import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchProductDetail = createAsyncThunk("productDetail/fetchProductDetail",
    // after running async call , it will give te return to dispatch
    async (id) => {
        console.log("inside async details", id)
        // get response from backend
        const response = await axios
            .get(`/api/v1/product/${id}`)
            .catch((err) => {
                console.log(err)
            })
        // to call actions, dispatch is used
        console.log(response.data)
        return (response.data)
    }
)
// for review
export const newReview = createAsyncThunk("productDetail/newReview",
    // after running async call , it will give te return to dispatch
    async (reviewData) => {
        console.log("inside async details", reviewData)
        const { rating, comment, id } = reviewData
        const myForm = new FormData();

        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);
        // get response from backend
        const config = {
            headers: { "Content-Type": "application/json" },
          };
      
          const { data } = await axios.put(`/api/v1/review`, myForm, config)
            .catch((err) => {
                console.log(err)
            })
        // to call actions, dispatch is used
        console.log(data)
        return (data)
    }
)
const productDetailSlice = createSlice({
    name: "productDetail",//name of slice
    initialState: { productDetail: {},review:{} },
    reducers: {
        // attaching actions with reducers
        // addMovies is not doing anything
        addMovies: (state, { payload }) => {
            state.movies = payload;
        }
    },
    // for asynchronous action 
    extraReducers: {
        [fetchProductDetail.pending]: () => {
            console.log("pending")
        },
        [fetchProductDetail.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, productDetail: payload }
        },
        [fetchProductDetail.rejected]: () => {
            console.log('rejected')
        },
        [newReview.pending]: () => {
            console.log("pending")
        },
        [newReview.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled",payload)
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, review: payload }
        },
        [newReview.rejected]: () => {
            console.log('rejected')
        },
    }

})

export default productDetailSlice.reducer
export const getProductDetail = (state) => state.productDetail.productDetail