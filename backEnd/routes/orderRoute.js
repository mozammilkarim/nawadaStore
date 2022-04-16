const express=require("express")
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controller/orderController")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authentication")
const router=express.Router()
module.exports=router
router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id")
    .get(isAuthenticatedUser,getSingleOrder)
router.route("/admin/orders")
    .get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders)
router.route("/admin/order/:id")
    .get(isAuthenticatedUser,authorizeRoles("admin"),getSingleOrder)
    .put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
    .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)

router.route("/my/orders")
    .get(isAuthenticatedUser,myOrders)

