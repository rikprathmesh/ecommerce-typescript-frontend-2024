import React, { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/CartItemCard";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitalState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import toast from "react-hot-toast";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import axios from "axios";
import { server } from "../redux/store";

// const subTotal = 4000;
// const tax = Math.round(subTotal * 0.18);
// const shippingCharges = 200;
// const discount = 400;
// const total = subTotal + tax + shippingCharges;

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitalState }) => state.cartReducer
    );

  const [coupenCode, setCoupenCode] = useState<string>("");
  const [isValidCoupenCode, setIsValidCoupenCode] = useState<boolean>(false);

  const increamentHandler = (cartItem: CartItem) => {
    if(cartItem.quantity >= cartItem.stock) return
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if(cartItem.quantity <= 1) return
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    const {token: cancelToken, cancel} = axios.CancelToken.source()
    const timeoutId = setTimeout(() => {
      axios.get(`${server}/api/v1/payment/discount?coupon=${coupenCode}`, {
        cancelToken
      })
      .then((res) => {
        // console.log(res.data);
        dispatch(discountApplied(res.data.discount))
        setIsValidCoupenCode(true);
        dispatch(calculatePrice())
        }).catch((err) => {
          // console.log(err.response.data.message);
          dispatch(discountApplied(0))
          setIsValidCoupenCode(false);
          dispatch(calculatePrice())
      })
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
      cancel()
      setIsValidCoupenCode(false);
    };
  }, [coupenCode]);

  // for calculating the subtotal
  useEffect(() => {
    dispatch(calculatePrice())
  }, [cartItems])
  
  return (
    <div className="cart">
      <main>
        {
          // cartItems.map((item, index) => (
          //   <CartItem key={index} cartItem={item} />
          // ))
          cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <CartItemCard
                key={index}
                cartItem={item}
                increamentHandler={increamentHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
              />
            ))
          ) : (
            <h1>No Items Added To Cart</h1>
          )
        }
      </main>
      <aside>
        <p>Subtotal: &#x20B9;{subtotal}</p>
        <p>Shipping Charges: &#x20B9;{shippingCharges}</p>
        <p>Tax: &#x20B9;{tax}</p>
        <p>
          Discount: <em className="red"> - &#x20B9;{discount}</em>
        </p>
        <p>
          <b>total: &#x20B9;{total}</b>
        </p>

        <input
          type="text"
          value={coupenCode}
          onChange={(e) => setCoupenCode(e.target.value)}
          placeholder="Coupen Code"
        />
        {coupenCode &&
          (isValidCoupenCode ? (
            <span className="green">
              &#x20B9;{discount} off using the <code>{coupenCode}</code>
            </span>
          ) : (
            <span className="red flex items-center gap-1">
              Invalid Coupen <VscError />
            </span>
          ))}
        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
