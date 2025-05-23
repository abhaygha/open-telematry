import React, { useEffect } from 'react';
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import PaymentFail from './pages/PaymentFail'
import PaymentSuccess from './pages/PaymentSuccess'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './ProtectedRoute.jsx';
// import { tracer } from './otel';

const App = () => {
//   useEffect(() => {
//     // ✅ Start a Span when the component mounts
//     const span = tracer.startSpan('AppComponentMount');
//     span.setAttribute('component', 'App');
    
//     // Simulate an API request and add a span
//     fetch('https://jsonplaceholder.typicode.com/todos/1')
//         .then(response => response.json())
//         .then(data => {
//             console.log('Fetched Data:', data);
//             span.addEvent('API Response Received');
//         })
//         .catch(error => {
//             console.error('Fetch error:', error);
//             span.recordException(error);
//         })
//         .finally(() => {
//             span.end(); // ✅ End the span after fetching
//         });

// }, []);



  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer/>
        <Navbar />
        <SearchBar/>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path="/collection" element={<Collection />} />
            <Route element={<ProtectedRoute />}>
              <Route path='/cart' element={<Cart/>} />
            </Route>
            <Route path='/about' element={<About/>} />
            <Route path='/contact' element={<Contact/>} />
            <Route path='/product/:productId' element={<Product/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/place-order' element={<PlaceOrder/>} />
            <Route path='/orders' element={<Orders/>} />
            <Route path='/Profile' element={<Profile/>} />
            <Route path='/payment/cancel' element={<PaymentFail/>} />
            <Route path='/payment/success' element={<PaymentSuccess/>} />
        </Routes>

        <Footer/>
        
    </div>
  )
}

export default App
