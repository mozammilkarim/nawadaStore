import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const FormData = require('form-data');
// update profile
export const forgotPassword = createAsyncThunk("profile/forgotPassword",
    // after running async call , it will give te return to dispatch
    async (email) => {
        // get response from backend
        const myForm = new FormData();
        myForm.set("email", email);
        const config = { headers: { "Content-Type": "application/json" } }
        const response = await axios
            .post(`/api/v1/forgot/password`, myForm, config)
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        // console.log(response.data)
        return (response.data)
    }
)
// update profile
export const resetPassword = createAsyncThunk("profile/resetPassword",
    // after running async call , it will give te return to dispatch
    async (formData) => {
        const {token,password,confirmPassword}=formData
        console.log(token,password,confirmPassword)
        // get response from backend
        const myForm = new FormData();
        
    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);
        const config = { headers: { "Content-Type": "application/json" } }
        const response = await axios
            .put(`/api/v1/password/reset/${token}`, myForm, config)
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        console.log(response.data)
        return (response.data)
    }
)
const resetPasswordSlice = createSlice({
    name: "user",//name of slice
    initialState: {
        user: {}, loading: false,success:false,
        message:""
    },
    reducers: {
        // attaching actions with reducers
        // addMovies is not doing anything
        LOGIN_REQUEST: (state, { payload }) => {
            return {
                loading: true,
                isAuthenticated: false
            }
        },
    },
    // for asynchronous action 
    extraReducers: {
        [forgotPassword.pending]: () => {
            console.log("pending")
            return { loading: false, isUpdated: false, }
        },
        [forgotPassword.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled", payload)
            return {
                loading: false,
                isUpdated: true,
                user: payload.user
            }
        },
        [forgotPassword.rejected]: (state, { payload }) => {
            console.log('rejected')
            return {
                loading: false, isUpdated: false,
                error: payload
            }
        },
        [resetPassword.pending]: () => {
            console.log("pending")
            return { loading: true, isUpdated: false, success:true,}
        },
        [resetPassword.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled", payload)
            return {
                loading: false,
                isUpdated: true,
                user: payload.user,
                success:true,
            }
        },
        [resetPassword.rejected]: (state, { payload }) => {
            console.log('rejected')
            return {
                loading: false, isUpdated: false,
                error: payload,success:false,
            }
        },
    }

})

export default resetPasswordSlice.reducer
export const getForgetDetails = (state) => state.resetPassword