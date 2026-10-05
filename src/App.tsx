import axios from "axios";
import { Navigate, replace, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";


const App = () => {

  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  //refresh token api calling
  async function refreshToken(){
    try {

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`, {withCredentials: true});

      // if Refresh token successfully generated
      if (response.data.success){
        setIsAuthenticated(true);
        navigate('/', {replace: true});
      }
      
      //If backend response not ok
    } catch (error: any) {
      navigate('/login', {replace: true});
    } 
  }

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check-auth`, { withCredentials: true });

        //If user logined
        if (response.data.success) {
          setIsAuthenticated(true);
          navigate('/', {replace: true});
        }

      } catch (error: any) {
        
        if (error.response?.status === 401){
          await refreshToken();
        }
        
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

  }, [])

  // If Loading
  if (loading){
    return <Loader />
  }

  return (
    <>
      {/* Routes  */}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to='/login' />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
