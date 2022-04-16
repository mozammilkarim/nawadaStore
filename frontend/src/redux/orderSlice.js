import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";


export const createOrder = createAsyncThunk("order/createOrder",
    // after running async call , it will give te return to dispatch
    async (order) => {
        console.log(order)
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post("/api/v1/order/new", order, config)
        .catch((err) => {
            console.log(err.response)
        })
        
        // store product details
        
        // localStorage.setItem("orderItems",JSON.stringify(useSelector(getCartDetail)))
        return (data)
    }
)
// show users orders
export const myOrder = createAsyncThunk("order/myOrder",
      async () => {
          console.log("working")
        const { data } = await axios
        .get("/api/v1/my/orders")
        .catch((err) => {
            console.log(err.response)
        })
        return (data.orders)
    }
)
// get specific  orders details
export const getOrderDetails = createAsyncThunk("order/getOrderDetails",
      async (id) => {
          console.log("working",id)
        const { data } = await axios.get(`/api/v1/order/${id}`)
        .catch((err) => {
            console.log(err.response)
        })
        return (data.order)
    }
)
// get all orders
export const fetchAdminOrders = createAsyncThunk("order/fetchAdminOrders",
    // after running async call , it will give te return to dispatch
    async () => {

        const { data } = await axios
            .get(`/api/v1/admin/orders`)
            .catch((err) => {
                console.log(err.response)
            })

        // to call actions, dispatch is used
        return (data.orders)
    }
)
export const updateOrder = createAsyncThunk("order/updateOrder",
    // after running async call , it will give te return to dispatch
    async ({id,status}) => {
        console.log(id,status)

        const myForm = new FormData();

     myForm.set("status", status);
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.put(`/api/v1/admin/order/${id}`, myForm, config)
        .catch((err) => {
            console.log(err.response)
        })
        
        // store product details
        console.log(data)
        // localStorage.setItem("orderItems",JSON.stringify(useSelector(getCartDetail)))
        return (data)
    }
)
export const deleteOrder = createAsyncThunk("order/deleteOrder",
    // after running async call , it will give te return to dispatch
    async (id) => {
        
        
        const { data } = await axios.delete(`/api/v1/admin/order/${id}`)
        .catch((err) => {
            console.log(err.response)
        })
        
        // store product details
        console.log(data)
        // localStorage.setItem("orderItems",JSON.stringify(useSelector(getCartDetail)))
        return (data)
    }
)
const orderSlice = createSlice({
    name: "orderDetails",//name of slice
    initialState: {
        loading:true,
         order:[] ,
        deleteSuccess:false,
        updateSuccess:false
    },
    reducers: {
        
    },
    // for asynchronous action 
    extraReducers: {
        [createOrder.pending]: () => {
            console.log("pending")
        },
        [createOrder.fulfilled]: (state, { payload }) => {
            console.log("order Created")
        },
        [createOrder.rejected]: () => {
            console.log('rejected')
        },
        [myOrder.pending]: () => {
            console.log("pending")
        },
        [myOrder.fulfilled]: (state, { payload }) => {
            console.log("order fetched",payload)
            return {
                order:payload,
                loading:false
            }
        },
        [myOrder.rejected]: () => {
            console.log('rejected')
        },
        [getOrderDetails.pending]: () => {
            console.log("pending")
        },
        [getOrderDetails.fulfilled]: (state, { payload }) => {
            console.log("order fetched",payload)
            return {
                order:payload,
                loading:false
            }
        },
        [getOrderDetails.rejected]: () => {
            console.log('rejected')
        },
        [fetchAdminOrders.pending]: () => {
            console.log("pending")
            
        },
        [fetchAdminOrders.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, order:payload,loading:false}
        },
        [fetchAdminOrders.rejected]: () => {
            console.log('rejected')
        },
        [updateOrder.pending]: () => {
            console.log("pending")
            
        },
        [updateOrder.fulfilled]: (state, { payload }) => {
            console.log("order updated")
            return {...state,updateSuccess:true}
        },
        [updateOrder.rejected]: () => {
            console.log('rejected')
        },
        [deleteOrder.pending]: () => {
            console.log("pending")
            
        },
        [deleteOrder.fulfilled]: (state, { payload }) => {
            console.log("order updated")
            return {...state,deleteSuccess:true}
        },
        [deleteOrder.rejected]: () => {
            console.log('rejected')
        },
    }

})

export default orderSlice.reducer
export const getOrderDetail = (state) => state.order
export const getLoadingDetail = (state) => state.loading
