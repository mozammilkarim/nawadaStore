import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./myOrders.css";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../loader/Loader";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Metadata from "../layout/Metadata";
import LaunchIcon from "@material-ui/icons/Launch";
import { getLoadingDetail, getOrderDetail, myOrder } from "../../redux/orderSlice";
import { getuserDetail } from "../../redux/userSlice";

const MyOrders = () => {
  const dispatch = useDispatch();
  useEffect(() => {
     dispatch(myOrder());
  }, [dispatch]);
  const {loading}=useSelector((state)=>state.orders)
  const orders=useSelector((state)=>state.orders.order)
  const user  = useSelector((state)=>state.user.user);
  // columns and rows to display order items
  // flex is used to stretch the orders
  // using fields, we access the columns(like name in input tag)
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      // for colouring the status column,changing class name
      // params gives u the whole row 
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
      flex: 0.3,
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
        // this in built function is used to get fields value
        // for each row
        return (
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows = [];

  orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  

  return (
    <Fragment>
      <Metadata title={`${user.name} - Orders`} />

      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="myOrdersTable"
            autoHeight
          />

          <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;


// import React from 'react'

// const MyOrders = () => {
//   return (
//     <div>MyOrders</div>
//   )
// }

// export default MyOrders