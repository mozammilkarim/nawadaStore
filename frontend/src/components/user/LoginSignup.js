import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import "./LoginSignUp.css";
import Loader from "../loader/Loader.js";
import { Link } from "react-router-dom"
import { useNavigate,useLocation } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { getuserDetail, loginUser, registerUser } from '../../redux/userSlice';
import Metadata from '../layout/Metadata';


const LoginSignup = () => {
  // useRef is used to access dom elements in react as we can't
  // access them directly
  const dispatch = useDispatch()
  const userDetail = useSelector(getuserDetail)
  let navigate = useNavigate();
  const location=useLocation()
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("../../images/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("../../images/Profile.png");

  const loginSubmit = (e) => {
    e.preventDefault();
    const argument = { loginEmail, loginPassword }
    dispatch(loginUser(argument));

  };
  const { loading, error, isAuthenticated } = userDetail
  // takes only shipping as value
  const redirect=location.search?("/"+location.search.split("=")[1]):"/account"
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect)
    }
  }, [isAuthenticated,navigate])



  //how will user know of wrong credentials, to add here
  
  function renderImage() {
    let array = []
    array.push(<img src={avatarPreview} alt="Avatar Preview" />)
    return array
  }

  const registerSubmit = async(e) => {
    e.preventDefault();

    await dispatch(registerUser({ name, email, password, avatar }));
    console.log("from register")
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      // for image file reading
      reader.onload = () => {
        // readstate=2 means when uploaded completely
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      // change user details
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const switchTabs = (e, tab) => {
    // it is used to change the form below the login/register button
    if (tab === "login") {
      // keep the things back to normal
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      // only show the register form
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? (<Loader />) : (
        <Fragment>
          <Metadata title={`Login/SignUp`} />
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/forgot/password">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              {/* registration */}
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  {/* {renderImage()} */}
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
        </Fragment>
      )}

    </Fragment>

  )
}

export default LoginSignup