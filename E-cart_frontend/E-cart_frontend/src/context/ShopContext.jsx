import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import Product from './../pages/Product';
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(null);

    const addToCart = async (itemId,size) => {
        if(!size){
            toast.error('Select Product Size');
            return;
        }
        
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] +=1;
            }
            else{
                cartData[itemId][size] = 1;  
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
    }

    const getCartData = async () => {
        try {
          const token = localStorage.getItem('access_token');
          const response = await fetch('http://localhost:8001/api/user/cart/list', {
            headers: { Authorization: `Bearer ${token}` }
        });
          return response.json()
        } catch (error) {
          if (error.response) {
              if (error.response.status === 401) {
                  console.error("Unauthorized: Invalid token or session expired.");
                  logoutUser()
                  toast.error('Session expired. Please log in again.');
              } else {
                  console.error("Error:", error.response.data);
                  toast.error('An error occurred.');
              }
          } else {
              console.error("Network Error:", error.message);
              toast.error("Network error. Please check your connection.");
          }
          return null;
        }
      };

   const getCartCount = () =>{
       return cartCount
    }
    
    const updateCartCount = (count) => {
        setCartCount(count)

        setTimeout(async () => {
            const oldCount = getCartCount()
            if (oldCount !== null && count !== oldCount) {
                console.log("caount---- ", count)
                console.log("oldCount---- ", oldCount)
                pageReload()
            }
        }, 100);
   }

   const updateQuantity = async (itemId,size,quantity) =>{
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;
    setCartItems(cartData);
   }

   const getCartAmount = () =>{
    let totalAmount = 0;
    for(const items in cartItems){
        let itemInfo = products.find((product) => product._id === items);
        for(const item in cartItems[items]){
            try{
                if(cartItems[items][item] > 0){
                    totalAmount += itemInfo.price * cartItems[items][item];
                }
            }catch(error){
                
            }
        }
    }
    return totalAmount;
   }

   const pageReload = () => {
        window.location.reload();
   }

    const value = {
        products, currency, delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems, addToCart, pageReload,
        getCartCount, updateCartCount, updateQuantity, getCartAmount, navigate
    }
    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
