import React from 'react'
import Helmet from "react-helmet"
// helmet allows title to change in each page

const Metadata = ({title}) => {
  return (
    <Helmet>
        <title>
             {title}
        </title>
    </Helmet>
  )
}

export default Metadata