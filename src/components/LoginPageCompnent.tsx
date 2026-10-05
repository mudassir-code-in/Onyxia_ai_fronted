
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import Loader from './Loader';
import { useState } from 'react';

const LoginPageComponent = () => {

    const [loading, setLoading] = useState(false);

  // Handle successful Google login response
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
        setLoading(true);
      const token = credentialResponse.credential;

      // Send the token to backend API 
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { token }, {withCredentials: true }
      );

      if (response.data.success){
        window.location.reload();
      }
    
    } catch (error: any) {
        //If any issue on server 
      console.error('Error sending token to backend:', error.response?.data || error.message);
      
    } finally {
        setLoading(false);
    } 
  };

  if (loading){
    return <Loader />
  }

  // Handle Google login failure
  const handleGoogleError = () => {
    console.log('Google Sign-In Failed');
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="relative flex items-center justify-center min-h-screen w-screen bg-[#0b0f19] overflow-hidden font-sans">
        
        {/* Background Ambient Glow Orbs */}
        <div className="absolute -top-[15%] -left-[10%] w-[450px] h-[450px] bg-[radial-gradient(circle,_rgba(99,102,241,0.25)_0%,_rgba(15,23,42,0)_70%)] rounded-full z-0"></div>
        <div className="absolute -bottom-[15%] -right-[10%] w-[450px] h-[450px] bg-[radial-gradient(circle,_rgba(168,85,247,0.2)_0%,_rgba(15,23,42,0)_70%)] rounded-full z-0"></div>

        {/* Main Glassmorphic Card Container */}
        <div className="relative z-10 bg-slate-800/70 backdrop-blur-xl border border-white/10 rounded-3xl p-10 w-full max-w-[400px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col items-center mx-4 box-border">
          
          {/* Top Brand Name & Subtitle */}
          <div className="text-center mb-8 w-full">
            <h1 className="m-0 mb-2 text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Onyxia AI
            </h1>
            <p className="m-0 text-sm text-slate-400 leading-normal">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          {/* Google Login Section */}
          <div className="w-full flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              shape="pill"
              width="100%"
            />
          </div>

          {/* Footer inside card */}
          <div className="mt-2 text-center text-xs tracking-wider">
            <span className="text-slate-500">powered by </span>
            <span className="text-slate-300 font-semibold">Mudassir</span>
          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPageComponent;