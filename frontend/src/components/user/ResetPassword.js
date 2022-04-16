import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import Metadata from "../layout/Metadata";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { getForgetDetails, resetPassword } from "../../redux/resetPasswordSlice";
import { useNavigate, useParams } from "react-router";

const ResetPassword = () => {
  const dispatch = useDispatch();
const params=useParams()
console.log("hello")
  const { loading,isUpdated } = useSelector(getForgetDetails);
  // const {isUpdated}=useSelector()
const navigate=useNavigate()
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
// console.log(params.token)
  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const argument={
        token:params.token,
        password:password,
        confirmPassword:confirmPassword
    }
    dispatch(resetPassword( argument));
  };

  useEffect(() => {
    // if (error) {
    //   alert.error(error);
    //   dispatch(clearErrors());
    // }

    if (isUpdated) {
      navigate("/login");
    }
  }, [dispatch, navigate,isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title="Change Password" />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Update Profile</h2>

              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >
                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResetPassword;