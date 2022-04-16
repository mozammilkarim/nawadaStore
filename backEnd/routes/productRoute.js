const express = require("express")
const { getAllProducts, createProduct, updateProduct,
    deleteProduct, singleProduct, createProductReview, getAllReviews, deleteReview, getAdminProducts } = require("../controller/productController")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authentication")

const router = express.Router()
module.exports = router
// exporting router function to be used
// sending the response at particular route
router.route("/product/:id").get(singleProduct)
router.route("/products").get(getAllProducts)
// router.route("/products").get(isAuthenticatedUser,authorizeRoles("admin"),getAllProducts)
router.route("/admin/product/new").put(isAuthenticatedUser, authorizeRoles("admin"), createProduct)
// as both have same url but different request methods
// to change product data, authentication is required
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview)
router.route("/reviews")
    .delete(isAuthenticatedUser, deleteReview)
    .get(getAllReviews)

router
    .route("/admin/products")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
