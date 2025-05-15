import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const {products} = useContext(ShopContext);
    console.log("products--- ", products);
    const [latestProducts, setLatestProducts] = useState([]);


    const fetchProducts = async () => {
      try {
          const apiUrl = `http://127.0.0.1:8000/api/products?ordering=-created_at&size=10`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
              throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          const productData = data.results;
          setLatestProducts(productData);
      } catch (err) {
          // setError(err.message);
          // setLoading(false);
      }
    }

    useEffect(()=>{
      fetchProducts()
    },[])

  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            lorem ipsum is simlply dummy text of the printing and typesetting industry.
            </p>
        </div>

    {/* Rendering products */}
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
      {
        latestProducts.map((item,index) => (
          <ProductItem key={index} id={item.id} image={item.images} name={item.name} price={item.price}/>
        ))
      }
    </div>
    </div>
  )
}

export default LatestCollection