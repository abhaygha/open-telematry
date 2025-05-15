import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = ({total}) => {

    const {currency, delivery_fee, getCartAmount }= useContext(ShopContext);

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTALS'}/>
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency} {total.subtotal}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Subscription Discount (20%)</p>
                <p>{currency} -{total.subscription_discount}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {total.shipping_price}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{currency} {total.total}</b>
            </div>
        </div>
    </div>
  )
}

export default CartTotal