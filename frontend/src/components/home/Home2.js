import React, { Fragment, useEffect } from 'react';
// cgMouse is used for importing mouse icon from react library
import "./Home.css";
import Metadata from '../layout/Metadata';
import ProductCard from "./ProductCard.js";
import {useSelector,useDispatch} from "react-redux"
const product={
  name:"klkl",
  images:[{url:"jbjkbj"}],
  price:120,
  id:"123s"
}


const Home2 = () => {
  // calling the dispatch function of redux
  // as soon page loads
  const dispatch=useDispatch();
// use selector to get state from store
// variable names same as of productReducer.js
// {loading,error,products,productsCount}
  const a=useSelector(
    (state)=>state.products
    // get products state from store
  )
 
  useEffect(() => {
    dispatch(getProducts())
    console.log(a)
  }, [dispatch])
  
  return (
    <Fragment>
        <Metadata title={"Nawada.Store"}/>
        <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            {/* {JSON.stringify(products)} */}
            <a href="#container">
              <button>
                Scroll 
              </button>
            </a>
        </div>
        <h2 className="homeHeading">Featured Products</h2>
        {typeof((products))}
          <div className="container" id="container">
            {/* {products &&
              products.forEach((product) => (
                <ProductCard key={product._id} product={product} />
              ))} */}

              
              {/* <ProductCard product={JSON.stringify(products)} /> */}
          </div>
     </Fragment>
  )
}

export default Home2