import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router"
import { Button } from "@material-ui/core";
import Metadata from "../layout/Metadata";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { deleteOrder, fetchAdminOrders } from "../../redux/orderSlice";

const OrderList = () => {
    const dispatch = useDispatch();
    const { deleteSuccess } = useSelector((state) => state.orders);
    const navigate = useNavigate()
    useEffect(() => {
        async function fetchMeOrder() {
            await dispatch(fetchAdminOrders());
        }

        fetchMeOrder()
        if(deleteSuccess)
        {
            navigate("/admin/orders")
        }

    }, [dispatch,deleteSuccess]);
    
    const orders = useSelector((state) => state.orders.order);
    const loading = useSelector((state) => state.orders.loading);


    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    };



    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered"
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 150,
            flex: 0.4,
        },

        {
            field: "amount",
            headerName: "Amount",
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
                        <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            onClick={() =>
                                deleteOrderHandler(params.getValue(params.id, "id"))
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

    if (!loading) {
        // console.log(loading, orders, "from admin/orders");
        for (let item = 0; item < orders.length; item++) {
            rows.push({
                id: orders[item]._id,
                itemsQty: orders[item].orderItems.length,
                amount: orders[item].totalPrice,
                status: orders[item].orderStatus,
            });
        }
    }


    return (
        <Fragment>
            <Metadata title={`ALL ORDERS - Admin`} />

            <div className="dashboard">
                <SideBar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL ORDERS</h1>

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

export default OrderList;