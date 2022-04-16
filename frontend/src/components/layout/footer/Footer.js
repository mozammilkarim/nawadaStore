import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>

      <footer id="footer">

        <div className="leftFooter">
          <h4>DOWNLOAD OUR APP</h4>
          <p>Download App for Android and IOS mobile phone</p>
          <img src={playStore} alt="playstore" />
          <img src={appStore} alt="Appstore" />
        </div>

        <div className="midFooter">
          <h1>Nawada.Store</h1>
          <p>High Quality is our first priority</p>

          <p>Copyrights 2022 &copy; Nawada.Store</p>
        </div>

        <div className="rightFooter">
          <h4>Follow Us</h4>
          <a href="http://instagram.com">Instagram</a>
          <a href="http://youtube.com">Youtube</a>
          <a href="http://facebook.com">Facebook</a>
          <h3 className="about">
            <Link to="/about">
              Know About Us?
            </Link>
          </h3>
        </div>
      </footer>

    </>
  );
};

export default Footer;