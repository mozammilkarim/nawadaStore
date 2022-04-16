import React, { Fragment, useEffect } from 'react';
import "./Home.css";
import Metadata from '../layout/Metadata.js';
import Loading from "../loader/Loader";
import ProductCard from "./ProductCard.js";
import { useSelector, useDispatch } from "react-redux"
import { fetchAsyncProducts, getAllProducts } from '../../redux/productSlice';


const Home = () => {

  const dispatch=useDispatch()
  
  useEffect(() => {
    dispatch(fetchAsyncProducts());
  },[dispatch])


  const products = useSelector(getAllProducts)
  let loading=(!products.success)
  function myMap(products) {
    // doing  little differently
    let mapItems = [];
    products.map((product, index) => {
      mapItems.push(<ProductCard key={product._id} product={product} />);
    })
    return mapItems
  }

  return (
    <Fragment>
      {
        loading ?
          (<Loading />) :
          (
            <Fragment>
              <Metadata title={"Nawada.Store"} />
              <div className="banner">
                <p>Welcome to Nawada.Store</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>
                <a href="#container">
                  <button>
                    Scroll
                  </button>
                </a>
              </div>
              <h2 className="homeHeading">Featured Products</h2>
              <div className="container" id="container">
        
                {myMap(products.product)}
              </div>
            </Fragment>
          )
      }
    </Fragment>
  )
}

export default Home