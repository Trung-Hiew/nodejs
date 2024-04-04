import React, { useState, useEffect } from 'react';
import LecturerPage from './component/Login/giangvien';
import StudentPage from './component/Login/sinhvien';
import AdminPage from './component/Login/admin';
import LoginForm from './component/Login/Login';
import { jwtDecode } from 'jwt-decode';


function App() {  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.MaGV) {
            setIsLoggedIn(true);
            setUserType('lecturer');
          } else if (decodedToken.username) {
            setIsLoggedIn(true);
            setUserType('admin');
          } else {
            setIsLoggedIn(true);
            setUserType('student');
          }
        } catch (error) {
          console.error('Invalid token:', error);
          setIsLoggedIn(false);
          setUserType('');
          localStorage.removeItem('token');
        }
      }
    };

    checkToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserType('');
  };

  const handleLogin = (accountType, token) => {
    setIsLoggedIn(true);
    setUserType(accountType);
    localStorage.setItem('token', token);
    console.log('Token đã được lưu vào localStorage:', token);
  };

  return (
    < div>
      {isLoggedIn ? (
        userType === 'lecturer' ? (
          <LecturerPage handleLogout={handleLogout} />
        ) : userType === 'admin' ? (
          <AdminPage handleLogout={handleLogout} userType={userType} />
        ) : (
          <StudentPage handleLogout={handleLogout} />
        )
      ) : (
        <LoginForm onLogin={handleLogin} userType={userType} />
      )}
    </div>
    
  );
}

export default App;
