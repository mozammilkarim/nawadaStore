import axios from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Action } from "history";
const FormData = require('form-data');

export const loginUser = createAsyncThunk("users/user",
// after running async call , it will give te return to dispatch
    async (argument) => {
        const email=argument.loginEmail
        const password=argument.loginPassword
        // get response from backend
        console.log(email,password)
        const config={headers:{"Content-Type":"application/json"}}
        const response = await axios
            .post(`/api/v1/login`,{email,password},config)
            .catch((err) => {
                console.log(err.response.message)
            })
        // to call actions, dispatch is used
        console.log(response)
        return (response.data.user)
    }
)
export const registerUser = createAsyncThunk("users/register",
// after running async call , it will give te return to dispatch
    async (formData) => {
        // console.log(formData)
        const {name,email,password,avatar}=formData
        // get response from backend
        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("avatar", avatar);
        // avatar file should be in kbs
        const config={headers:{"Content-Type":"multipart/form-data"}}
        const response = await axios
            .post(`/api/v1/register`,myForm,config)
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
        // to call actions, dispatch is used
        console.log(response.data)
        return (response.data)
    }
)
// load existing user
export const loadUser = createAsyncThunk("users/loadUser",
// after running async call , it will give te return to dispatch
    async () => {
        // get response from backend
        const response = await axios
            .get(`/api/v1/me`)
            .catch((err) => {
                console.log(err.response.data.message)
            })
        // to call actions, dispatch is used
        console.log(response,"user loaded")
        return (response.data.user)
    }
)
// logout existing user
export const logout = createAsyncThunk("users/logout",
// after running async call , it will give te return to dispatch
    async () => {
        // get response from backend
        const response = await axios
            .get(`/api/v1/logout`)
            .catch((err) => {
                console.log(err.response.data.message)
            })
        // to call actions, dispatch is used
        console.log(response,"user logged out")
        return (response.data)
    }
)

export const fetchAdminUsers = createAsyncThunk("users/fetchAdminUsers",
    // after running async call , it will give te return to dispatch
    async () => {

        const { data } = await axios
            .get(`/api/v1/admin/users`)
            .catch((err) => {
                console.log(err.response)
            })

        // to call actions, dispatch is used
        return (data.users)
    }
)
export const deleteUser = createAsyncThunk("users/deleteUser",
    // after running async call , it will give te return to dispatch
    async (id) => {

        const { data } = await axios
            .delete(`/api/v1/admin/user/${id}`)
            .catch((err) => {
                console.log(err.response)
            })

        // to call actions, dispatch is used
        return (data)
    }
)
// give specific user
export const getSingleUser = createAsyncThunk("users/getSingleUser",
    // after running async call , it will give te return to dispatch
    async (id) => {

        const { data } = await axios
            .get(`/api/v1/admin/user/${id}`)
            .catch((err) => {
                console.log(err.response)
            })

        // to call actions, dispatch is used
        return (data.user)
    }
)
const userSlice = createSlice({
    name: "user",//name of slice
    initialState:{user:{},loading:false,
    isAuthenticated:false,allUsers:[],
    deleteSuccess:false
    },
    reducers: {
        // attaching actions with reducers
        // addMovies is not doing anything
        LOGIN_REQUEST: (state, { payload }) => {
            return {loading:true,
            isAuthenticated:false}
        },
        
    },
    // for asynchronous action 
    extraReducers:{
        [loginUser.pending]:()=>{
            console.log("pending")
            return {loading:true}
        },
        [loginUser.fulfilled]:(state,{payload})=>{
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            return { loading:false,
                isAuthenticated:true,user:payload}
        },
        [loginUser.rejected]:(state,{payload})=>{
            console.log('rejected')
            return {loading:false,
                isAuthenticated:false,user:null,
                error:"Invalid Username or Password"}
        },
        [registerUser.pending]:()=>{
            console.log("pending")
            return { loading:true}
        },
        [registerUser.fulfilled]:(state,{payload})=>{
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            return { loading:false,
                isAuthenticated:true,user:payload.user}
        },
        [registerUser.rejected]:(state,{payload})=>{
            console.log('rejected from register')
            return {loading:false,
                isAuthenticated:false,user:null,
                error:"Invalid Username or Password"}
        },
        [loadUser.pending]:()=>{
            console.log("pending")
            return {loading:true, isAuthenticated:false,user:null,}
        },
        [loadUser.fulfilled]:(state,{payload})=>{
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            return { loading:false,
                isAuthenticated:true,user:payload}
        },
        [loadUser.rejected]:(state,{payload})=>{
            console.log('rejected')
            return {loading:false,
                isAuthenticated:false,user:null,
                error:"Invalid Username or Password"}
        },
        [logout.pending]:()=>{
            console.log("pending")
            return {loading:true}
        },
        [logout.fulfilled]:(state,{payload})=>{
            // here payload is the data that we've got from async return
            console.log("fulfilled",payload)
            return { loading:false,
                isAuthenticated:false,user:null}
        },
        [logout.rejected]:(state,{payload})=>{
            console.log('rejected')
            return {loading:false,
                isAuthenticated:false,user:null,
                error:"Invalid Username or Password"}
        },
        [fetchAdminUsers.pending]: () => {
            console.log("pending")
            
        },
        [fetchAdminUsers.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, allUsers:payload}
        },
        [fetchAdminUsers.rejected]: () => {
            console.log('rejected')
        },
        [deleteUser.pending]: () => {
            console.log("pending")
            
        },
        [deleteUser.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, deleteSuccess:true}
        },
        [deleteUser.rejected]: () => {
            console.log('rejected')
        },
        [getSingleUser.pending]: () => {
            console.log("pending")
            
        },
        [getSingleUser.fulfilled]: (state, { payload }) => {
            // here payload is the data that we've got from async return
            console.log("fulfilled")
            // returning state and data to be added using dispatch
            // this line is adding data to movies property of movies reducer
            return { ...state, allUsers:payload}
        },
        [getSingleUser.rejected]: () => {
            console.log('rejected')
        },
        
    }
    
})

export default userSlice.reducer
export const getuserDetail = (state) => state.user