import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import Metadata from "../layout/Metadata";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import SideBar from "./Sidebar";

import Loader from "../loader/Loader";
import { useNavigate, useParams } from "react-router";
import { getSingleUser } from "../../redux/userSlice";
import { updateRoleProfile } from "../../redux/updateProfileSlice";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const  loading = useSelector((state) => state.user.loading);

  const  user = useSelector((state) => state.user.allUsers);

  const { isUpdated } = useSelector((state) => state.updateProfile);
  const updateLoading = useSelector((state) => state.updateProfile.loading);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const userId = params.id;

  useEffect(() => {
    // load respective user details
    // and feed to respective column fields
    console.log(user)
    if (user && user._id !== userId) {
      dispatch(getSingleUser(userId));
    } else {
      if(user){

      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      }
    }
   
    if (updateLoading) {
      console.log("User Updated Successfully");
      navigate("/admin/users");
    }
  }, [dispatch,  updateLoading, user, userId]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const updateData={ name, email, role } 


    dispatch(updateRoleProfile({userId, updateData}));
  };

  return (
    <Fragment>
      <Metadata title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <form
              className="createProductForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>

              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
                id="createProductBtn"
                type="submit"
                disabled={
                  updateLoading ? true : false || role === "" ? true : false
                }
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;