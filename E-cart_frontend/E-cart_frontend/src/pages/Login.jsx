import React, { useState } from 'react'
import { sendOTP, verifyOTP } from './auth'
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);  // Step 1: Enter Email, Step 2: Enter OTP
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidOTP = (otp) => /^[0-9]{4}$/.test(otp);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; 

  const handleSendOTP = async () => {
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email");
      return;
    }

    setLoading(true);
    try {
      await sendOTP(email);
      toast.success('OTP sent successfully');
      setStep(2);
    } catch (error) {
        toast.error('Error sending OTP');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!isValidOTP(otp)) {
      toast.error("Enter a valid 4-digit OTP");
      return;
    }
  
    setLoading(true);
    try {
      const response = await verifyOTP(email, otp);
      toast.success('Login successful');
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate(from, { replace: true });
    } catch (error) {
        toast.error('Invalid OTP');
    }
    setLoading(false);
  };

  const onSubmitHandler = async (event) =>{
    event.preventDefault();
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
       <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>Login</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div> 
        <input type="email"
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Email' required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={step === 2}
        />

        {step === 2 && (
          <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 mb-4 w-64"
          />
        )}

        {step === 1 ? (
            <button onClick={handleSendOTP} className={`bg-black text-white font-light px-8 py-2 mt-4 ${!email || loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!email || loading}>
                {loading ? 'Sending...' : 'Send OTP'}
            </button>
        ) : (
            <button onClick={handleVerifyOTP} className="bg-black text-white font-light px-8 py-2 mt-4" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
        )}
    </form>
  )
}

export default Login