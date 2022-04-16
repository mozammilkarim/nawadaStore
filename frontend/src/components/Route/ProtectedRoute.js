import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getuserDetail } from "../../redux/userSlice";
import Metadata from "../layout/Metadata";
const ProtectedRoute = () => {
    const { loading, isAuthenticated, user } = useSelector(getuserDetail);

    const location = useLocation();
    console.log("authLogin", isAuthenticated);
    // if the user is authenticated , then redirect to the 
    // requested page,i.e., /account page,
    //  else redirecting to login page
    return (
        <Fragment>
            <Metadata title={`Nawada.Store`} />
            {/* we need to fix thiis */}
            {(isAuthenticated!==true)
                ? 
                 <Navigate to="/login" replace state={{ from: location }} />
                 :<Outlet />}
        
        </Fragment>
    );
};

export default ProtectedRoute;