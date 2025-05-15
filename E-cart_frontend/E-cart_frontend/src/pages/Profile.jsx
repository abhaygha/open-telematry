import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { getProfile, updateProfile } from './auth';
import { toast } from 'react-toastify';

const Profile = () => {

  const [method,setMethod] = useState('cod');
  const {navigate} = useContext(ShopContext);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
        const response = await getProfile();
        setUser(response.data);
        setFormData(response.data);
        setLoading(false);
    } catch (error) {
        // toast.error('Failed to fetch profile');
    }
  };

  const handleUpdate = async () => {
    try {
        await updateProfile(formData);
        toast.success('Profile updated successfully');
        fetchProfile();
    } catch (error) {
        toast.error('Failed to update profile');
    }
  };

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'PROFILE'} text2={'INFORMATION'}/>
        </div>
        <div className='flex gap-3'>
          <input onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            value={formData.first_name || ''}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            value={formData.last_name || ''}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            value={formData.email} type="email" placeholder='Email Address' disabled />
        {/* <input  className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' /> */}
        <div className='flex gap-3'>
          {/* <input  className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input  className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' /> */}
        </div>
        <div className='flex gap-3'>
          <input  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
            value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input onChange={(e) => setFormData({ ...formData, country: e.target.value })}
           value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            value={formData.phone || ''}
            type="number" placeholder='Phone' />  
        <button onClick={handleUpdate} className="bg-black text-white font-light px-8 py-2 mt-4">
            Update Profile
        </button>
      </div>
    </div>
  )
}

export default Profile