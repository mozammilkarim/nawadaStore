import React, { Fragment, useEffect, useRef, useState } from "react";
import CheckoutSteps from "./CheckoutSteps.js";
import { useSelector, useDispatch } from "react-redux";
import Metadata from "../layout/Metadata";
import { Typography } from "@material-ui/core";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useNavigate } from "react-router";
import { createOrder } from "../../redux/orderSlice.js";
import { addToLocalStorage, removeCartItem } from "../../redux/cartSlice.js";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);
  const navigate = useNavigate()
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const paymentData = {
    // because stripe takes payment in paise
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;

        console.log(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // completing order information
          order.PaymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(createOrder(order));
          // to remove from local storage
          const newCartItems = JSON.parse(localStorage.getItem("cartItems"))
          cartItems.forEach(async (cartItem) => {
            await dispatch(removeCartItem(cartItem.product));
            await dispatch(addToLocalStorage());
          });
          navigate("/success");
        } else {
          console.log("There's some issue while processing payment ");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      console.log(error.response.data.message);
    }
  };
  const payByCash = async (e) => {
    console.log("pay by cash")

    // completing order information
    // creating a random id for purchase
    order.PaymentInfo = {
      id: `${user.name}${Math.floor(Math.random() * 100)}`,
      status: "COD",
    };

    await dispatch(createOrder(order));
    // remove order from cartItems of local storage
    const newCartItems = JSON.parse(localStorage.getItem("cartItems"))
    cartItems.forEach(async (cartItem) => {
      await dispatch(removeCartItem(cartItem.product));
      await dispatch(addToLocalStorage());
    });
    navigate("/success");

  }
  return (
    <Fragment>
      <Metadata title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <div className="COD">
          <button type="submit" onClick={(e) => payByCash(e)}>Pay By Cash</button>
        </div>
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;
