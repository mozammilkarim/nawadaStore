import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { fetchAsyncProducts, getAllProducts } from '../../redux/productSlice'
import ProductCard from '../home/ProductCard'
import Loader from '../loader/Loader'
import "./products.css"
import Pagination from "react-js-pagination"
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
// to filter based on categories
const categories = [
  "Grains",
  "Pulses",
  "Spices",
  "Oils",
  "Miscellaneous"
];


const Products = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const productsFetched = useSelector(getAllProducts)
  const { resultsPerPage, productsCount, filteredProductsCount } = productsFetched;

  // set currentPage as a state variable initialised as 1
  const [currentPage, setCurrentPage] = useState(1)
  const [price, setPrice] = useState([0, 2500]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);


  const setCurrentPageNo = (e) => {
    setCurrentPage(e)
  }
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
  let argument;
  useEffect(() => {
    argument = { params, currentPage, price, category ,ratings}
    dispatch(fetchAsyncProducts(argument))
  }, [dispatch, params, currentPage, price, category,ratings])

  function renderProducts(products) {
    // doing  little differently
    let mapItems = [];
    // condition for empty product list 
    // in case of filtering happens
    if (products.length === 0) {
      mapItems.push(<div>Sorry, No such product</div>);
    }
    products.map((product, index) => {
      
      mapItems.push(<ProductCard key={product._id} product={product} />);
    })
    return mapItems
  }

  return (
    <Fragment>
      {
        (!productsFetched.success) ? (<Loader />) : (
          <Fragment>
            <h2 className="productsHeading">PRODUCTS</h2>
            <div className="products">
              {renderProducts(productsFetched.product)}
            </div>
            <div className="filterBox">
              <Typography>Price</Typography>
              <Slider
                value={price}
                onChange={priceHandler}
                // auto is used for on click price show
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={2500}
              />
              {/* for category filtering */}
              <Typography>Categories</Typography>
              <ul className="categoryBox">
                {categories.map((category) => (
                  <li
                    className="category-link"
                    key={category}
                    // category is changing
                    onClick={() => setCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
              <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
            </div>
            {/* if we have more products than results per pg */}
            {filteredProductsCount > resultsPerPage ?
              (<div className="paginationBox">
                {/* pagination is rendered as a ul list */}
                {/* having some default classes */}
                {/* so style them using dev tool of chrome */}
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultsPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                /></div>
              ) : (<div></div>)

            }
          </Fragment>
        )
      }

    </Fragment>
  )
}

export default Products