import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const FormData = require('form-data');
// update self profile 
export const updateProfile = createAsyncThunk("profile/updateProfile",
    // after running async call , it will give te return to dispatch
    async (formData) => {
        console.log(formData)
        const { name, email, avatar } = formData
        // get response from backend
        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("avatar", avatar);
        // avatar file should be in kbs
        const config = { headers: { "Content-Type": "multipart/form-data" } }
        const response = await axios
            .put(`/api/v1/me/update`, myForm, config)
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
// update password
export const updatePassword = createAsyncThunk("profile/updatePassword",
    // after running async call , it will give te return to dispatch
    async (formData) => {
        
    const {oldPassword,newPassword,confirmPassword} =formData
    console.log(formData)
    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
        // get response from backend
        const config = { headers: { "Content-Type": "application/json" } }
        const response = await axios
            .put(`/api/v1/update/password`, myForm, config)
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
// updates role, etc . by admin
export const updateRoleProfile = createAsyncThunk("profile/updateProfile",
    // after running async call , it will give te return to dispatch
    async ({userId,updateData}) => {
        console.log(userId,updateData)
        const { name, email, role } = updateData
        // get response from backend
        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);
        // avatar file should be in kbs
        const config = { headers: { "Content-Type": "multipart/form-data" } }
        const response = await axios
            .put(`/api/v1/admin/user/${userId}`, myForm, config)
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
const updateProfileSlice = createSlice({
    name: "user",//name of slice
    initialState: {
        user: {}, loading: false,
        isUpdated: false
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
        [updateProfile.pending]: () => {
            console.log("pending")
            return { loading: true, isUpdated: false, }
        },
        [updateProfile.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled", payload)
            return {
                loading: false,
                isUpdated: true,
                user: payload.user
            }
        },
        [updateProfile.rejected]: (state, { payload }) => {
            console.log('rejected')
            return {
                loading: false, isUpdated: false,
                error: payload
            }
        },
        [updatePassword.pending]: () => {
            console.log("pending")
            return { loading: true, isUpdated: false, }
        },
        [updatePassword.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled", payload)
            return {
                loading: false,
                isUpdated: true,
                user: payload.user
            }
        },
        [updatePassword.rejected]: (state, { payload }) => {
            console.log('rejected')
            return {
                loading: false, isUpdated: false,
                error: payload
            }
        },
        [updateRoleProfile.pending]: (state) => {
            console.log("pending")
            return {...state, loading: true, isUpdated: false }
        },
        [updateRoleProfile.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled", payload)
            return {...state,
                loading: false,
                isUpdated: true,
            }
        },
        [updateRoleProfile.rejected]: (state, { payload }) => {
            console.log('rejected')
            
        },
    }

})

export default updateProfileSlice.reducer
export const updatedUserProfile = (state) => state.updateProfile