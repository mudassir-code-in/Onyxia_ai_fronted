import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";

const App = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{ name?: string; email?: string; avatar?: string }>({});
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes('/api/auth/refresh-token')) {
          return Promise.reject(error);
        }

        if (!navigator.onLine || !error.response) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshResponse = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`,
              { withCredentials: true }
            );

            if (refreshResponse.data.success) {
              if (refreshResponse.data.user) {
                setUserData(refreshResponse.data.user);
              }
              setIsAuthenticated(true);
              return axios(originalRequest);
            }
          } catch (refreshError) {
            if (!navigator.onLine) {
              return Promise.reject(refreshError);
            }

            setIsAuthenticated(false);
            setUserData({});
            navigate('/login', { replace: true });
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!import.meta.env.VITE_BACKEND_URL) {
        console.error("VITE_BACKEND_URL is not defined in .env");
        setLoading(false);
        return;
      }

      if (!navigator.onLine) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/check-auth`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setIsAuthenticated(true);
          if (response.data.user) {
            setUserData(response.data.user);
          }
        }
      } catch (error: any) {
        if (navigator.onLine) {
          setIsAuthenticated(false);
          setUserData({});
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-semibold fixed top-0 left-0 right-0 z-50 shadow-md">
          ⚠️ You are currently offline. Some features might be limited.
        </div>
      )}

      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated || !isOnline ? (
              <Home 
                name={userData.name} 
                email={userData.email} 
                avatar={userData.avatar} 
              />
            ) : (
              <Navigate to='/login' replace />
            )
          } 
        />
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? <Login /> : <Navigate to='/' replace />
          } 
        />
      </Routes>
    </>
  );
};

export default App;