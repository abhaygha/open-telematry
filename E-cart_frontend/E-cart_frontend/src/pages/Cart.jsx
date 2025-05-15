import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './../components/Title';
import { assets } from '../assets/assets';
import CartTotal from './../components/CartTotal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Cart = () => {
  
  const [cartData, setCartData] = useState([]);
  const [cartTotal, setcartTotal] = useState({});
  const navigate = useNavigate();
  
  const {currency, updateCartCount, pageReload }= useContext(ShopContext);

  const getCart = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8001/api/user/cart/list', {
        headers: { Authorization: `Bearer ${token}` }
    });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
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

  const fetchCartData = async () => {
    const tempData = await getCart();
    setCartData(tempData.results);
    setcartTotal(tempData.total);
    updateCartCount(tempData.results.length)
  };

  const updateCartItem = async (cartId, quantity) => {
    try {
      const token = localStorage.getItem('access_token');
      const response =  await axios.put(
          `http://127.0.0.1:8001/api/user/cart/update/${cartId}/`,
          { quantity },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCartData()
      return response
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

  const removeCartItem = async (cartId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.delete(`http://127.0.0.1:8001/api/user/cart/delete/${cartId}/`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      fetchCartData()
      return response
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

  useEffect(() => {
    fetchCartData();
  },[])


  return (
    <div className='border-t pt-14'>

      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'}/>
      </div>

      <div >
        {
          cartData.map((item,index) => {

            return(
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                  <div className='flex items-start gap-6'>
                    <img className='w-16 sm:w-20' src={item.images[0]} alt="" />
                    <div >
                      <p className='text-sm sm:text-lg font-medium'>{item.name}</p>
                      <div className='flex items-center gap-5 mt-2'>
                          <p>{currency}{item.price}</p>
                          <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                      </div>
                    </div>
                  </div>
                  <input onChange={(e)=>e.target.value === '' || e.target.value === '0' ? null : updateCartItem(item.id, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity}/>
                  <img onClick={()=>removeCartItem(item.id)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
              </div>
            )
          })
        }
      </div>

      <div className='flex justify-end my-20'>
          <div className='w-full sm:w-[450px]'>
            <CartTotal total={cartTotal} />
            <div className='w-full text-end'>
              <button onClick={()=>navigate('/place-order')}
                className='bg-black text-white text-sm my-8 px-8 py-3' disabled={ cartData.length < 1 }
                style={{ opacity: cartData.length < 1 ? 0.5 : 1}}
              >PROCEED TO PAY</button>
            </div>
          </div>
      </div>
        
    </div>
  )
}

export default Cart