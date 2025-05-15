import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { getProfile } from './auth';

const Orders = () => {
  const {currency} = useContext(ShopContext);
  const [products, setProducts] = useState([]);


  const getOrders = async () => {
    let user_profile = await getProfile();
    user_profile = user_profile.data

    const order_response = await fetch(`http://127.0.0.1:8004/api/orders/${user_profile.id}/`, {
      method: "GET",
    });
    const data = await order_response.json();
    return data    
  };
  
  
  const fetchOrdersData = async () => {
    const products = await getOrders();
    setProducts(products)
    console.log("products.items ", products)
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchOrdersData();
  },[])

  return (
    <div className='border-t pt-16'>
        <div className='text-2xl'>
          <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        <div className=''>
          {
            products.map((order,index)=>(
              <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                  <div className='flex items-start gap-6 text-sm'>
                    <img className='w-16 sm:w-20' src={order.item.image} alt="" />
                    <div>
                      <p className='sm:text-base font-medium'>{order.item.product_name}</p>
                      <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                        <p className='text-lg'>{currency}{order.item.price_per_item}</p>
                        <p>Quantity: {order.item.quantity}</p>
                        <p>Size: {order.item.size}</p>
                      </div>
                      <p className='mt-2'>Date :<span className='text-gray-400'>{formatDate(order.created_at)}</span></p>
                    </div>
                  </div>
                  <div className='md:w-1/2 flex justify-between'>
                      <div>
                        <div className='flex items-center gap-2' style={{ flexDirection: "rown" }}>
                          <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                          <p className='text-sm md:text-base'>Order Status: {order.status}</p>
                        </div>
                      <div className='flex items-center gap-2' style={{ flexDirection: "rown" }}>
                        <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                        <p className='text-sm md:text-base'>Payment Status: {order.payment_status}</p>
                      </div>
                    </div>
                    {/* <button className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button> */}
                  </div>
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default Orders