import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const Category = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedcategory, setSelectedcategory] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchProducts = async (category) => {
      try {
          const category_response = await fetch("http://127.0.0.1:8000/api/categories");
          if (!category_response.ok) {
              throw new Error('Failed to fetch category');
          }
          const category_temp = await category_response.json();

          let tempCategory = category
          console.log("tempCategory ", tempCategory)
          if (!tempCategory) {
            tempCategory = category_temp[0].name
            setSelectedcategory(category_temp[0].name)
          }
          setCategories(category_temp);

          setTimeout(async () => {
            const apiUrl = `http://127.0.0.1:8000/api/products?category=${tempCategory}&size=10`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            const productData = data.results;
            setProducts(productData);
            setLoading(false)
          }, 20);

      } catch (err) {
        setLoading(false)
      }
    }

    const handleSelectedCategory = async (category) => {
      console.log("clickec --- ", category)
      setSelectedcategory(category)
      setTimeout(async () => {
        fetchProducts(category)
      }, 20);
    }

    useEffect(() => {
      fetchProducts()
    },[])

  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'Categories'} text2={''}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Shop By Wide Range Of Categories.
            </p>
        </div>

        <div className="pb-4 pt-2 d-flex overflow-auto pills-fast-delivery flex justify-center ">
            {
                categories.map((category, index) => (
                    <span key={category.name} onClick ={()=>handleSelectedCategory(category.name)}
                      className={`fast-delivery-button-pill cursor-pointer mr-2 p-2 px-6 btn ${
                        selectedcategory === category.name ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                      // className="fast-delivery-button-pill  cursor-pointer mr-2 p-2 px-6 btn fast-delivery-button-pill-selected"
                      >{category.name}</span>
                ))
            }
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            { !loading &&
                products.map((item,index) =>(
                  <ProductItem key={index} id={item.id} name={item.name} image={item.images} price={item.price}/>  
                ))
            }
        </div>
    </div>
  )
}

export default Category