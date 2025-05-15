import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
import axios from 'axios';
import { submitReview } from './auth'
const Product = () => {

  const {productId} = useParams();
  const {currency, pageReload} = useContext(ShopContext);
  const [productData,setProductData] = useState(false);
  const [image,setImage] = useState('')
  const [size, setSize] = useState('')
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [productReview, setProductReview] = useState([])
  const [subpage, setSubpage] = useState("description");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");


  const addToCart = async (productId, size) => {
    try {
      if (!size) {
        toast.error("Please Select Size.")
        return
      }
      const token = localStorage.getItem('access_token');
      const response =  await axios.post(
          `http://127.0.0.1:8001/api/user/cart/add/`,
          { product_id: productId, quantity: 1, size },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Item Added to Cart.');
      return response;

    } catch (error) {
      if (error.response) {
          if (error.response.status === 401) {
              console.error("Unauthorized: Invalid token or session expired.");
              logoutUser()
              toast.error('Session expired. Please log in again.');
          } else {
              console.error("Error:", error.response.data);
              toast.error(error.message);
          }
      } else {
          console.error("Network Error:", error.message);
          toast.error("Network error. Please check your connection.");
      }
      return null;
   }
  };

  const addToCartItem = (productId, size) => {
    addToCart(productId, size)
  }

  const fetchReviewRatings = async (productId) => {
    try {
        const url = `http://127.0.0.1:8001/api/user/reviews/review/${productId}/`
        const token = localStorage.getItem('access_token');
        const response = await fetch(url, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log("retings_response--- ", data)
        setAverageRating(data.average_rating)
        setProductReview(data.reviews)
        setTotalRatings(data.reviews.length)
    } catch (err) {
        // setError(err.message);
        // setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const url = `http://127.0.0.1:8000/api/products/${productId}/`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            // setProducts(data);
            setProductData(data);
            setImage(data.images[0])
            // setLoading(false);
        } catch (err) {
            // setError(err.message);
            // setLoading(false);
        }
    };
    fetchProducts();    
    fetchReviewRatings(productId)
  }, [])

  const renderreviews = () => {
    console.log("productReview---- ", productReview)
    return (
      <div className="flex flex-col py-6 overflow-x-auto space-x-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc transparent" }}>
        {
          productReview.map((review,index)=>(
              <div key={review.id} className="py-6 px-6 min-w-[250px] flex flex-col items-left p-4 rounded-lg shadow-md bg-white"
                style={{ disply: "flex", flexDrection: "row" }} >
                  <div style={{ display: "flex" }}>
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
                    </div>
                    <p className="px-4 font-bold mt-2">{review.user.first_name}</p>
                  </div>
                  <p className="gap-2 mt-2 ext-yellow-500 flex items-center">{renderStars(review.rating)}</p>
                  <p className="text-gray-700 mt-2">Reviewd On: {formatDate(review.created_at)}</p>
                  <p className="mt-3 font-bold text-sm">{review.comment}</p>
              </div>
            ))
        }
    </div>
    )
  }
  
  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <img
          key={`full-${i}`}
          src={assets.star_icon}
          alt="full star"
          className="w-3.5"
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <img
          key="half"
          src={assets.star_half_icon}
          alt="half star"
          className="w-3.5"
        />
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <img
          key={`empty-${i}`}
          src={assets.star_dull_icon}
          alt="empty star"
          className="w-3.5"
        />
      );
    }

    return stars;
  };

  const handleSubmit = async () => {
    try {
        await submitReview(productId, rating, comment);
        fetchReviewRatings(productId)
        toast.success("Review submitted!");
    } catch (error) {
        toast.error("Failed to submit review.");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };
  
  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
        {/* product data */}
        <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

          {/* Product images */}
          <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
            <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.images.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                ))
              }
            </div>
            <div className='w-full sm:w-[80%]'>
                <img className='w-full h-auto' src={image} alt="" />
            </div>
          </div>
          {/* --------Product info ---------- */}

          <div className='flex-1 '>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <div className='flex items-center gap-1 mt-2'>
              {renderStars()}({totalRatings})

            </div>
              <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
              <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
              <div className='flex flex-col gap-4 my-8'>
                <p>Select Size</p>
                <div className='flex gap-2'>
                  {productData.sizes.map((item,index)=>(
                    <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                  ))}
                </div>
              </div>
              <button onClick={()=> addToCartItem(productData.id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
              <hr className='mt-8 sm:w-4/5'/>
              <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                <p>100% Original Product</p>
                <p>Cash on delivery is available on this product</p>
                <p>Easy return and exchange policy within 7 days</p>
              </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg">Write a Review</h3>
          <select 
              value={rating} 
              onChange={(e) => setRating(parseInt(e.target.value))} 
              className="border p-2"
          >
              {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Stars</option>)}
          </select>
          <textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              className="border w-full p-2 my-2"
              placeholder="Write your review..."
          />
          <button 
              onClick={handleSubmit} 
              className="bg-blue-500 text-white px-4 py-2 rounded"
          >
              {"Submit Review"}
          </button>
        </div>

        {/* ------------------DEscription and review section --------------------------*/}
        <div className='mt-20'>
            <div className='flex'>
                  <button onClick={()=>setSubpage("description")} style={{ cursor: "pointer" }}><b className='border border-gray-500 px-5 py-3 text-sm '>Description</b></button>
                  {/* <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button> */}
                  <button onClick={()=>setSubpage("reviews")} style={{ cursor: "pointer" }}><b className='border border-gray-500 px-5 py-3 text-sm'>Review ({totalRatings})</b></button>
            </div>
            {
              subpage == "description" ?
(            <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500' style={{ marginTop: "20px" }}>
                  <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals con showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer
                  </p>
                  <p>
                  E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (eg. sizes, colors). Each product usually has its own dedicated poge with relevant information
                  </p>
            </div>) :
            (
              renderreviews()
            )
          }
        </div>
        {/* --------------------display related products--------------------------- */}
        <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product