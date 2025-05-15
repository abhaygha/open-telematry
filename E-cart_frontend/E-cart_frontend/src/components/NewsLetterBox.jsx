import React, { useState } from 'react'
import { toast } from 'react-toastify';

const NewsLetterBox = () => {
    const [email, setEmail] = useState("")

    const subscribeUser = async () => {
      try {
          const response = await fetch("http://127.0.0.1:8001/api/user/subscribe/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({"email": email}),
          });
  
          if (!response.ok) {
              throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          console.log("Subscription successful!");
          toast.success("Subscribed successfully!");
      } catch (error) {
          console.error("Error subscribing user:", error);
          toast.error("Error subscribing user")
          return null;
      }
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        subscribeUser()
    }
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'> Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>
        lorem ipsum is simlply dummy text of the printing and typesetting industry.  
        </p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3' >
            <input onChange={(e) => setEmail(e.target.value)} className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required />
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>Subscribe</button>
        </form>
        
    </div>
  )
}

export default NewsLetterBox