import React, { useState, Fragment } from "react";
import Metadata from "../layout/Metadata";
import "./Search.css";

const Search = () => {
  // state variable to get the input value of product
  const [keyword, setKeyword] = useState("");

  const searchSubmitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      // if anything is typed, change the url
      window.location.assign(`/products/${keyword}`);
    } else {
      // for empty
      window.location.assign(`/products/`);
    }
  };

  return (
    <Fragment>
      <Metadata title="Search a Product -- Nawada.Store" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        {/* on change in input value ,text is grabbed */}
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;