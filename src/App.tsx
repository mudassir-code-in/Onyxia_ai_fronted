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

  // Axios response interceptor for automatic token refresh on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loop if refresh-token itself returns 401
        if (originalRequest.url?.includes('/api/auth/refresh-token')) {
          return Promise.reject(error);
        }

        // If access token expired (401) and request hasn't been retried yet
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

              // Retry the original failed request
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, clear auth and redirect to login
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

  // Check initial authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check if backend URL is defined to avoid bad requests
      if (!import.meta.env.VITE_BACKEND_URL) {
        console.error("VITE_BACKEND_URL is not defined in .env");
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
        setIsAuthenticated(false);
        setUserData({});
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loader while checking auth
  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
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
  );
};

export default App;