import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { Button } from "@material-ui/core";
import Metadata from "../layout/Metadata";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { deleteProduct, fetchAdminProducts } from "../../redux/productSlice";

const ProductList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    
    const { products } = useSelector((state) => state.products);
    console.log(products)
      const { deleteSuccess } = useSelector(
        (state) => state.products
      );
      useEffect(() => {

        dispatch(fetchAdminProducts());
        if(deleteSuccess){
            // simply reloading
            navigate("/admin/products")
            console.log("product deleted")
        }
    }, [dispatch,deleteSuccess,navigate]);
    const deleteProductHandler = async(id) => {
        await dispatch(deleteProduct(id));
        console.log(deleteSuccess)
        
    };
    



    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

        {
            field: "name",
            headerName: "Name",
            minWidth: 350,
            flex: 1,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },

        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 270,
            flex: 0.5,
        },

        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            onClick={() =>
                                deleteProductHandler(params.getValue(params.id, "id"))
                            }
                        >
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                );
            },
        },
    ];

    const rows = [];

    // i have not used direct approach because, it was not working
    if (products) {
        for (let index = 0; index < products.length; index++) {
            rows.push({
                id: products[index]._id,
                stock: products[index].stock,
                price: products[index].price,
                name: products[index].name,
            });
        }
    }

    return (
        <Fragment>
            <Metadata title={`ALL PRODUCTS - Admin`} />

            <div className="dashboard">
                <SideBar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default ProductList;