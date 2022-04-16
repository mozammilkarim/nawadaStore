//controller includes responses to be given after the route
// import product collection of database
const ApiFeature = require("../utils/ApiFeature");
const Products = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/asyncError")
const cloudinary = require("cloudinary");
// create products --only admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    let images = [];
    // taking the images passed
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];
    // uploading the images to cloudinary
    // and storing their respective url and public Id in imagesLinks
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });
        // publicId is used to access the image by its actual name
        // not using machine generated name
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    // finally storing images link in database
    req.body.images = imagesLinks
    // assign user from id recorded at time of login
    req.body.user = req.user.id
    const product = await Products.create(req.body);
    res.status(201).json({ success: true, product });
});

// get all products list
exports.getAllProducts = catchAsyncError(async (req, res) => {
    const resultsPerPage = 5;
    const productsCount = await Products.countDocuments();
    const apiFeature = new ApiFeature(Products.find(), req.query)
        .search().filter();
    let product = await apiFeature.query;
    let filteredProductsCount = product.length;
    // first consructor to get filtered products length and
    //  2 to find actual products result
    const apiFeature2 = new ApiFeature(Products.find(), req.query)
        .search().filter().pagination(resultsPerPage);
    product = await apiFeature2.query;
    res.status(200)
        .json({ success: true, product, productsCount, resultsPerPage, filteredProductsCount })
});
// update an existing product by admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Products.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: "Not found" })

    }

    // Images Start Here
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    // only when we have some images to change
    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }

    product = await Products.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true, useFindAndModify: true
    })
    res.status(201).json({ success: true, product })
})
// for deleting product --admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    let product = await Products.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: "Not found" })

    }
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await product.remove()
    res.status(201).json({ success: true, message: "product deleted" })
});
// find single products
exports.singleProduct = catchAsyncError(async (req, res, next) => {
    let product = await Products.findById(req.params.id);
    if (!product) {
        // return res.status(404).json({success:false,message:"Not found"})
        return next(new ErrorHandler(404, "NOt Found"))
    }
    res.status(201).json({ success: true, product })
})

// create a product review or update a review
exports.createProductReview = catchAsyncError(async (req, res, next) => {

    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment, productId
    }
    // find if the product is already
    //  reviewed by the same user logged in 
    const product = await Products.findById(productId);
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === review.user.toString()
    )
    if (isReviewed) {
        // if reviewed, only change the required thing
        product.reviews.forEach(rev => {
            if (rev.user.toString() === review.user.toString()) {
                rev.comment = req.body.comment;
                rev.rating = req.body.rating;
            }
        });
    } else {
        // else add as a new review
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length
    }

    let avg = 0;
    // taking the average of reviews for average rating
    product.reviews.forEach((rev) => {
        avg += rev.rating
    })
    product.ratings = avg / product.reviews.length
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        review
    })
})

// get all reviews of a product
exports.getAllReviews = catchAsyncError(async (req, res, next) => {
    //  product id is given in url
    const product = await Products.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler(404, "Product not Found"))
    }
    res.status(201).json({ success: true, reviews: product.reviews })

})
// delete a review of a product
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    //  product id is given in url
    const product = await Products.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler(404, "Product not Found"))
    }
    // match for the review._id with review id given(passed)
    // and give all reviews except that review
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    )
    let avg = 0;
    // taking the average of reviews for average rating
    product.reviews.forEach((rev) => {
        avg += rev.rating
    })
    const ratings = avg / product.reviews.length
    const numOfReviews = product.reviews.length;
    await Products.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    })
    res.status(201).json({ success: true, reviews: product.reviews })

})

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Products.find();

    res.status(200).json({
        success: true,
        products,
    });
});