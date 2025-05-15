import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { getProfile, updateProfile } from './auth';
import { loadStripe } from "@stripe/stripe-js";
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method,setMethod] = useState('cod');
  const {navigate} = useContext(ShopContext);
  const [addressForm, setAddressForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState({});

  const fetchProfile = async () => {
    try {
        let response = await getProfile();
        response = response.data
        setAddressForm({
          "first_name": response.first_name,
          "last_name": response.last_name,
          "email": response.email,
          "phone": response.phone,
          "country": response.country,
          "zipcode": response.zipcode,
        });
    } catch (error) {
    }
  };

  const verifyForm = () => {
    if (!addressForm.first_name) return false
    if (!addressForm.last_name) return false
    if (!addressForm.email) return false
    if (!addressForm.phone) return false
    if (!addressForm.country) return false
    if (!addressForm.zipcode) return false
    if (!addressForm.street) return false
    if (!addressForm.city) return false
    if (!addressForm.state) return false
    return true
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

  const fetchCartData = async () => {
    const tempData = await getCartData();
    setCartTotal(tempData.total);
  };

  useEffect(() => {
    fetchProfile();
    fetchCartData()
    setLoading(false);
  }, []);

  const placeOrder = async (order_type) => {
    let user_profile = await getProfile();
    user_profile = user_profile.data

    const order_response = await fetch("http://127.0.0.1:8004/api/orders/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "customer_id": user_profile.id,
        "customer_email": user_profile.email,
        "method": order_type,
        'address': addressForm,
      }),
    });
    return order_response    
  };

  const handleCheckout = async () => {
    const resp = await placeOrder(method)
    console.log("method------------- ", method)
    const order_data = await resp.json();
    if (resp.status != 201) {
      toast.error(order_data.error)
      return
    }

    toast.success(order_data.message)
    console.log("order_data.orders ", order_data.orders)
    if (method == "stripe") {
      const stripePromise = loadStripe("pk_test_51Qza4YHyA90H0mY47EbOI6d8L1EDQKHDb4DkxB0u1kjvnOoFPVmASOj8ZTx4YUWhm97ZWEDVqO0Ccjf7uJNobezv007h5Mb2XP");
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8003/api/payments/create-checkout-session/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal.total,
          product_name: "Test Product",
          order_ids: order_data.orders,
        }),
      });
      const data = await response.json();
      
      if (data.sessionId) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        alert("Error creating session!");
      }
    } else {
      window.location.href = "/orders";
    }
    setLoading(false);
  };

  return (! loading &&
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
        <div className='flex gap-3'>
          <input  onChange={(e) => setAddressForm({ ...addressForm, first_name: e.target.value })} 
            value={addressForm.first_name || ''} 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' required />
          <input  onChange={(e) => setAddressForm({ ...addressForm, last_name: e.target.value })} 
            value={addressForm.last_name || ''} 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input  onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })} 
            value={addressForm.email || ''} 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email Address' />
        <input  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} 
            value={addressForm.street || ''} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} 
            value={addressForm.city || ''} 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} 
            value={addressForm.state || ''} 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input  onChange={(e) => setAddressForm({ ...addressForm, zipcode: e.target.value })} 
            value={addressForm.zipcode || ''} 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} 
            value={addressForm.country || ''} 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} 
            value={addressForm.phone || ''} 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />  
      </div>

            {/* ---------------------RIGHT SIDE----------------  */}
            <div className='mt-8'>
              <div className='mt-8 min-w-80'>
                <CartTotal total={cartTotal} />
              </div>

              <div className='mt-12'>
                <Title text1={'PAYMENT'} text2={'METHOD'}/>
                {/* **************** PAYMENT METHOD ************ */}
                <div className='flex gap-3 flex-col lg:flex-row'>
                  <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                    <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                  </div>
{/* 
                  <div onClick={()=>setMethod('razopay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razopay' ? 'bg-green-400' : ''}`}></p>
                    <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
                  </div> */}

                  <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                    <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                    <p className='text-gray-500 text-sm font-medium mx-4' >CASH ON DELIVERY</p>
                  </div>
                </div>

                <div className='w-full text-end mt-8'>
                  <button onClick={()=>handleCheckout()} 
                  className={`bg-black text-white px-16 py-3 text-sm ${!verifyForm() ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white'}`}
                  >PLACE ORDER</button>
                </div>
              </div>
            </div>
    </div>
  )
}

export default PlaceOrder