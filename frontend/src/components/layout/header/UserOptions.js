import React, { Fragment, useState } from 'react'
import "./Header.css"
import { SpeedDial, SpeedDialAction } from "@material-ui/lab"
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { logout } from '../../../redux/userSlice';
import { useDispatch ,useSelector} from 'react-redux';
import { getCartDetail } from '../../../redux/cartSlice';
import Loader from '../../loader/Loader';
const UserOptions = ({ userDetail }) => {
    const user = userDetail.user
    const loading=useSelector((state)=>state.user.loading)
    const {cartItems}=useSelector(getCartDetail)
    const dispatch=useDispatch()
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ShoppingCartIcon style={{color:cartItems.length>0?"tomato":"unset"}}/>, name: `Cart(${cartItems.length})`, func: cart },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ];

    // if user is logged in , only then check
    if ((user!==null)&& user.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func: dashboard,
        });
    }
    function dashboard() {
        navigate("/admin/dashboard");
    }

    function orders() {
        navigate("/orders");
    }
    function account() {
        navigate("/account");
    }
    function cart() {
        navigate("/cart");
    }
    function logoutUser() {
        dispatch(logout());
        alert("Logout Successfully")
    }

    return (<Fragment>
        {loading?(<Loader/>):(
            <Fragment>
            {/* backdrop is used to give a shady look to background
             when, in our case when speedDial is open, 
             look at open prperty*/}
             {/* open means when to active that thing,or hover over */}
            
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{ zIndex: "11" }}
                open={open}
                direction="down"
                className="speedDial"
                // some bug in putting icon
                icon={
                    <img
                        className="speedDialIcon"
                        src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                        alt="Profile"
                    />
                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}
            </SpeedDial>
        </Fragment>
        )}
    </Fragment>
        
    )
}

export default UserOptions