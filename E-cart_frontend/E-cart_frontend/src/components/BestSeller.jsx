import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const {products} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    const fetchProducts = async () => {
      try {
          const apiUrl = `http://127.0.0.1:8000/api/products?bestseller=true&size=10`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
              throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          const productData = data.results;
          setBestSeller(productData);
      } catch (err) {
      }
    }

    useEffect(() => {
      fetchProducts()
    },[])

  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'BEST'} text2={'SELLERS'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            lorem ipsum is simlply dummy text of the printing and typesetting industry.
            </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                bestSeller.map((item,index) =>(
                  <ProductItem key={index} id={item.id} name={item.name} image={item.images} price={item.price}/>  
                ))
            }
        </div>
    </div>
  )
}

export default BestSeller