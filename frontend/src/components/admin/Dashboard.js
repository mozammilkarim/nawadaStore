import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
// import { getAdminProduct } from "../../actions/productAction";
// import { getAllOrders } from "../../actions/orderAction.js";
// import { getAllUsers } from "../../actions/userAction.js";
import Metadata from "../layout/Metadata";
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'
import { fetchAdminProducts, getAllProducts } from "../../redux/productSlice.js";
import { fetchAdminOrders } from "../../redux/orderSlice.js";
import { fetchAdminUsers } from "../../redux/userSlice.js";
ChartJS.register(...registerables);

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      // You can await here
      await dispatch(fetchAdminProducts());
      await dispatch(fetchAdminOrders());
      await dispatch(fetchAdminUsers());
    }
    fetchData();


  }, [dispatch]);
  const { products, loading } = useSelector((state) => state.products);

    const  order  = useSelector((state) => state.orders.order);

    const users = useSelector((state) => state.user.allUsers);
  // console.log("hello",users,order)
  let outOfStock = 0;


  // i have not used direct approach because, it was not working
  if (products) {
    for (let index = 0; index < products.length; index++) {
      if (products[index].stock === 0) {
        outOfStock += 1;
      }
    }
  }


    let totalAmount = 0;
    if(order){
      for (let index = 0; index < order.length; index++) {
        totalAmount += order[index].totalPrice;
        
      }
    }

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  return (
    <div className="dashboard">
      <Metadata title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹{totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products && products.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{order && order.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



// import React from 'react'

// const Dashboard = () => {
//     // Chart.register(CategoryScale)
//     const lineState = {
//             labels: ["Initial Amount", "Amount Earned"],
//             datasets: [
//               {
//                 label: "TOTAL AMOUNT",
//                 backgroundColor: ["tomato"],
//                 hoverBackgroundColor: ["rgb(197, 72, 49)"],
//                 data: [0, 1233],
//               },
//             ],
//           };
//     return (
//         <div className="dashboard">
//             <Metadata title="Dashboard - Admin Panel" />
//             <Sidebar />

//             <div className="dashboardContainer">
//                 <Typography component="h1">Dashboard</Typography>

//                 <div className="dashboardSummary">
//                     <div>
//                         <p>
//                             Total Amount <br /> ₹{234}             </p>
//                     </div>
//                     <div className="dashboardSummaryBox2">
//                         <Link to={"/admin/products"}>
//                             <p>Product</p>
//                             {/* <p>{products && products.length}</p> */}
//                         </Link>
//                         <Link to={"/admin/order"}>
//                             <p>Orders</p>
//                             {/* <p>{order && order.length}</p> */}
//                         </Link>
//                         <Link to={"/admin/users"}>
//                             <p>Users</p>
//                             {/* <p>{users && users.length}</p> */}
//                         </Link>
//                     </div>
//                     <Line data={lineState} />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Dashboard
