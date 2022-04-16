import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router"
import { fetchProductDetail, getProductDetail, newReview } from '../../redux/productDetailSlice';
import "./ProductDetail.css"
import ReviewCard from "../review/ReviewCard.js";
import Loader from "../loader/Loader";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { addToCartItems, addToLocalStorage } from '../../redux/cartSlice';
const ProductDetail = () => {
  // match is used to get data from url , like req.params
  let { id } = useParams()//productId
  const dispatch = useDispatch()
  const params = useParams()
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  let productFetched = useSelector(getProductDetail)
  const review = useSelector(
    (state) => state.productDetail.review
  );

  // function to render carousel images , to add here
  let product;
  if (productFetched) {
    product = productFetched.product
  }
  function myMapper() {
    let itemArray = []
    if (productFetched.success) {

      product.images && product.images.map((item, index) => {
        itemArray.push(<img key={item.url} src={item.url} alt={`${index} slide`} />)
      })

    } else {
      itemArray.push(<div>Sorry ...Product does not exist at moment</div>)
    }
    return itemArray
  }

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    console.log(product.stock, "from increase")
    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };
  const {isAuthenticated}=useSelector((state)=>state.user)
  const addToCartHandler = async () => {
    // user should be authenticated order Items 
    if (!isAuthenticated) {
      alert("Please Login!")
      return
    }
    if (quantity > product.stock) {

      alert("Out Of Stock")
      return
    }
    const argument = { id: params.id, quantity }
    await dispatch(addToCartItems(argument));
    // store locally in local storage 
    // only after cart loaded
    dispatch(addToLocalStorage())
    alert("Item added to your cart, check it!")
    console.log("itemadded")
  };

  const submitReviewToggle = () => {
    if (!isAuthenticated) {
      alert("Please Login!")
      return
    }
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    
    // add a review to database
    dispatch(newReview({ rating, comment, id }));
    // after submitting close review taker
    setOpen(false);
  };
  useEffect(() => {

    dispatch(fetchProductDetail(id));
  }, [dispatch, id, review]);

  const options = {
    value: 5,
    readOnly: true,
    precision: 0.5,
  };
  function renderDescription() {
    if (productFetched.success) {
      options.value = product.ratings;
    }

  }

  function reviewMapper() {
    const itemArray = []

    if (productFetched.success) {
      // console.log(Boolean(product.reviews))
      if (product.reviews.length) {
        product.reviews && product.reviews.map((review, index) => {

          itemArray.push(<ReviewCard review={review} key={index} />)
        })
      }
      else {
        itemArray.push(<div className='noReviews'>Sorry ...No Review </div>)
      }

    }
    return itemArray
  }

  return (

    < >
      {/* to render whole page when page loaded */}
      {!productFetched ? (<Loader />) : (<Fragment>
        <div className="ProductDetails">
          <div>
            <div className="CarouselImage">

              {myMapper()}
            </div>
          </div>
          {renderDescription()}
          {JSON.stringify(productFetched) !== "{}" && (

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product.name}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  ({product.numberOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>
                <p>
                  Status:
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>
              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>

              <h3 className="reviewsHeading">REVIEWS</h3>

              <Dialog
                aria-labelledby="simple-dialog-title"
                open={open}
                onClose={submitReviewToggle}
              >
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent className="submitDialog">
                  <Rating
                    onChange={(e) => setRating(e.target.value)}
                    value={rating}
                    size="large"
                  />

                  <textarea
                    className="submitDialogTextArea"
                    cols="30"
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </DialogContent>
                <DialogActions>
                  <Button onClick={submitReviewToggle} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={reviewSubmitHandler} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>

            </div>)}
        </div>
        <div className="reviewSection">
          <h3 className="reviewsHeading">REVIEWS</h3>
          {reviewMapper()}
        </div>
      </Fragment>)}
    </>

  )
}

export default ProductDetail