const express=require("express")
const router=express.Router()
const {registerUser,loginUser,logOutUser, forgotPass,
    resetPassword, displayUser, updatePassword, updateProfile, getAllUsers, getUser, deleteProfile, updateUser}=require("../controller/userController")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authentication")
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logOut").get(logOutUser)
router.route("/forgot/password").post(forgotPass)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser,displayUser)
router.route("/update/password").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateUser)

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)

router.route("/admin/user/:id")
    .get(isAuthenticatedUser,authorizeRoles("admin"),getUser)
    .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProfile)
    .put(isAuthenticatedUser,authorizeRoles("admin"),updateProfile)



module.exports=router

