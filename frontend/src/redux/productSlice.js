// import { actionTypes ,ALL_PRODUCT_REQUEST,ALL_PRODUCT_SUCCESS
// ,ALL_PRODUCT_FAIL,CLEAR_ERROR} from "../constants/action-types";
import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAsyncProducts = createAsyncThunk("products/fetchAsyncProducts",
    // after running async call , it will give te return to dispatch
    async (argument = {}) => {
        // default value of keyword is set empty
        // get response from backend
        const { currentPage, params, price, category, ratings } = argument;
        let keyword = "";
        let link = `/api/v1/products`

        // console.log(argument,"-->price from async\n",currentPage,params,price)
        // for specific filters
        if (!(JSON.stringify(argument) === JSON.stringify({}))) {
            // if keyword is provided pass it
            if (!(JSON.stringify(params) === JSON.stringify({}))) {
                keyword = params.keyword
                // console.log(params)
            }
            link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
            //    if category is there add it
            if (category) {
                link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`
            }

        }
        console.log(link)
        const response = await axios
            .get(link)
            .catch((err) => {
                console.log(err)
            })

        // to call actions, dispatch is used
        return (response.data)
    }
)
export const fetchAdminProducts = createAsyncThunk("products/fetchAdminProducts",
    // after running async call , it will give te return to dispatch
    async () => {

        const { data } = await axios
            .get(`/api/v1/admin/products`)
            .catch((err) => {
                console.log(err.response)
            })

        // to call actions, dispatch is used
        return (data.products)
    }
)
export const createNewProduct = createAsyncThunk("products/createNewProduct",
    // after running async call , it will give te return to dispatch
    async (productData) => {
        const { name, price, description, category, stock, images } = productData
        const myForm = new FormData()
        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);

        images.forEach((image) => {
            myForm.append("images", image);
        });
        console.log(name, price, description, category, stock, images, "from slice")
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const { data } = await axios
            .put(`/api/v1/admin/product/new`, myForm, config)
            .catch((err) => {
                console.log(err.response)
            })

        // to call actions, dispatch is used
        return (data)
    }
)
export const deleteProduct = createAsyncThunk("products/deleteProduct",
    // after running async call , it will give te return to dispatch
    async (id) => {

        const { data } = await axios
            .delete(`/api/v1/admin/product/${id}`)
            .catch((err) => {
                console.log(err.response)
            })

        // to call actions, dispatch is used
        return (data.success)
    }
)
export const fetchReviewProducts = createAsyncThunk("products/fetchReviewProducts",
    // after running async call , it will give te return to dispatch
    async (productId) => {

        const { data } = await axios
            .get(`/api/v1/reviews?productId=${productId}`)
            .catch((err) => {
                console.log(err.response)
            })

        // to call actions, dispatch is used
        return (data.reviews)
    }
)
export const deleteReviewProducts = createAsyncThunk("products/deleteReviewProducts",
    // after running async call , it will give te return to dispatch
    async ({reviewId,productId}) => {

        const { data } = await axios
            .delete(`/api/v1/reviews?id=${reviewId}&productId=${productId}`)
            .catch((err) => {
                console.log(err.response)
            })

        // to call actions, dispatch is used
        return (data)
    }
)

export const updateProduct = createAsyncThunk("products/updateProduct",
    // after running async call , it will give te return to dispatch
    async ({ productId, productData }) => {
        const { name, price, description, category, stock ,images} = productData
        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("Stock", stock);

        // images.forEach((image) => {
        //     console.log(image)
        //     myForm.append("images", image);
        // });
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const { data } = await axios
            .put(`/api/v1/admin/product/${productId}`, myForm, config)
            .catch((err) => {
                console.log(err.response)
            })

        // to call actions, dispatch is used
        return (data.success)
    }
)

const productSlice = createSlice({
    name: "products",//name of slice
    initialState: {
        products: [],
        newProduct: { loading: false, success: false },
         updateSuccess: false,
        reviews:{
            loading:false,
            reviews:[]
        },
        deleteReview:{
            deleteSuccess: false,
            loading:false
        }
    },
    reducers: {
        // attaching actions with reducers
        // addMovies is not doing anything
        // addMovies: (state, { payload }) => {
        //     state.movies = payload;
        // },
        resetProduct:(state)=>{
            state.newProduct.success=false;
        }
    },
    // for asynchronous action 
    extraReducers: {
        [fetchAsyncProducts.pending]: () => {
            console.log("pending")
        },
        [fetchAsyncProducts.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, products: payload }
        },
        [fetchAsyncProducts.rejected]: () => {
            console.log('rejected')
        },
        [fetchAdminProducts.pending]: () => {
            console.log("pending")

        },
        [fetchAdminProducts.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, products: payload }
        },
        [fetchAdminProducts.rejected]: () => {
            console.log('rejected')
        },
        [createNewProduct.pending]: (state) => {
            console.log("pending")
            return { ...state, newProduct: { loading: true, success: false } }
        },
        [createNewProduct.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled", payload)
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, newProduct: { loading: false, success: true } }
        },
        [createNewProduct.rejected]: () => {
            console.log('rejected')
            return { newProduct: { loading: false, success: false } }
        },
        [deleteProduct.pending]: (state) => {
            console.log("pending")

        },
        [deleteProduct.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled", payload)
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { deleteSuccess: true }
        },
        [deleteProduct.rejected]: () => {
            console.log('rejected')
        },
        [updateProduct.pending]: (state) => {
            console.log("pending")
            return { loading:true,updateSuccess: false }
        },
        [updateProduct.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled", payload)
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { loading:false,updateSuccess: true }
        },
        [updateProduct.rejected]: () => {
            console.log('rejected')
            return {  loading: false,updateSuccess: false }
        },
        [fetchReviewProducts.pending]: (state) => {
            console.log("pending")
            return { ...state, reviews:{
                loading:true,
            } }

        },
        [fetchReviewProducts.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, reviews:{
                loading:false,
                reviews:payload
            } }
        },
        [fetchReviewProducts.rejected]: () => {
            console.log('rejected')
        },
        [deleteReviewProducts.pending]: (state) => {
            console.log("pending")
            return { ...state, deleteReview:{
                deleteSuccess: false,
                loading:true
            } }

        },
        [deleteReviewProducts.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, deleteReview:{
                deleteSuccess: true,
                loading:false
            } }
        },
        [deleteReviewProducts.rejected]: () => {
            console.log('rejected')
        },
    }

})

export default productSlice.reducer
export const { resetProduct } = productSlice.actions
export const getAllProducts = (state) => state.products.products 
