import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
      <Title text1={'CONTACT'} text2={'US'}/>
    </div>

    <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
      <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
      <div className='flex flex-col justify-center items-start gap-6'>
        <p className='font-semibold text-xl text-gray-600'>Our Store</p>
        <p className='text-gray-500'>54709 Pune Station <br/>Laxmi Road, Pune, India </p>
        <p className='text-gray-500'>Tel:(+91) 9454981628<br/>Email: admin@ecart.com</p>
        <p className='font-semibold text-xl text-gray-600'>Careers at E-cart</p>
        <p className=' text-gray-500'>Learn more about job openings</p>
      </div>
    </div>
    </div>

    
  )
}

export default Contact