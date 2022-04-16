import React, { Fragment, useState, useEffect } from "react";
import "./UpdatePassword.css";
import Loader from "../loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import Metadata from "../layout/Metadata";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { getuserDetail, loadUser } from "../../redux/userSlice";
import { updatedUserProfile, updatePassword } from "../../redux/updateProfileSlice";
import { useNavigate } from "react-router";

const UpdatePassword = ({ history }) => {
    const dispatch = useDispatch();

    const navigate = useNavigate()
    const { loading, user } = useSelector(getuserDetail);
    const { isUpdated } = useSelector(updatedUserProfile);


    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        dispatch(updatePassword({ oldPassword, newPassword, confirmPassword }));
    };

    useEffect(() => {
        if (isUpdated) {
            navigate("/account");
            dispatch(loadUser());
        }
    }, [dispatch, navigate, isUpdated]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <Metadata title="Change Password" />
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h2 className="updatePasswordHeading">Update Profile</h2>

                            <form
                                className="updatePasswordForm"
                                onSubmit={updatePasswordSubmit}
                            >
                                <div className="loginPassword">
                                    <VpnKeyIcon />
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>

                                <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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
                                    value="Change"
                                    className="updatePasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default UpdatePassword;