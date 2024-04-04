import React, { useState } from 'react';
import axios from 'axios';
import { MDBCheckbox, MDBBtnGroup, MDBInput, MDBCol, MDBRow, MDBBtn } from 'mdb-react-ui-kit';
import '../CSS/Login.css';

function LoginForm({ onLogin }) {
  const [loginData, setLoginData] = useState({
    MaSV: '',
    MaGV: '',
    username: '',
    password: ''
  });
  const [accountType, setAccountType] = useState('student');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: name === 'MaGV' ? value.trim() : value
    });
  };

  const handleAccountTypeChange = (e) => {
    const selectedAccountType = e.target.value;
    setAccountType(selectedAccountType);
    setLoginData({
      ...loginData,
      MaSV: '',
      MaGV: '',
      username: '',
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      let loginEndpoint = '';
      let loginDataToSend = { ...loginData };
      if (accountType === 'admin') {
        loginEndpoint = 'http://localhost:5000/admin/login';
        loginDataToSend = {
          username: loginData.username,
          password: loginData.password
        };
      } else {
        loginEndpoint = 'http://localhost:5000/auth/login';
      }
      console.log('Submit login form with data:', loginDataToSend);
      const response = await axios.post(loginEndpoint, loginDataToSend);
      const token = response.data.token;
      if (!token) {
        throw new Error('Token không được trả về từ server');
      }
      localStorage.setItem('token', token);
      console.log('Token đã được lưu vào localStorage:', token);
      onLogin(accountType, token);
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      setError('Đăng nhập thất bại');
    }
  };

  return (
    <div className="container">
      <MDBBtnGroup>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="radio"
              id="student"
              name="accountType"
              value="student"
              checked={accountType === 'student'}
              onChange={handleAccountTypeChange}
            />
            <MDBCheckbox
              name="btnCheck"
              btn
              id="btn-check"
              wrapperTag="span"
              label="Sinh Viên"
              htmlFor="student"
            />

            <input
              type="radio"
              id="lecturer"
              name="accountType"
              value="lecturer"
              checked={accountType === 'lecturer'}
              onChange={handleAccountTypeChange}
            />
            <MDBCheckbox
              name="btnCheck"
              btn
              id="btn-check2"
              wrapperClass="mx-2"
              wrapperTag="span"
              label="Giảng Viên"
              htmlFor="lecturer"
            />

            <input
              type="radio"
              id="admin"
              name="accountType"
              value="admin"
              checked={accountType === 'admin'}
              onChange={handleAccountTypeChange}
            />
            <MDBCheckbox
              name="btnCheck"
              btn
              id="btn-check3"
              wrapperTag="span"
              label="Admin"
              htmlFor="admin"
            />

            <div>
              {(accountType === 'student' || accountType === 'lecturer') && (
                <div>
                  <MDBInput
                    className="mb-4"
                    type="text"
                    name={accountType === 'student' ? 'MaSV' : 'MaGV'}
                    value={loginData[accountType === 'student' ? 'MaSV' : 'MaGV']}
                    onChange={handleChange}
                  />

                  <MDBInput
                    className="mb-4"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                  />
                </div>
              )}
              {accountType === 'admin' && (
                <div>
                  <MDBInput
                    className="mb-4"
                    type="text"
                    name="username"
                    value={loginData.username}
                    onChange={handleChange}
                  />

                  <MDBInput
                    className="mb-4"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                  />
                </div>
              )}
              <MDBRow className="mb-4">
                <MDBCol className="d-flex justify-content-center">
                  <MDBCheckbox id="form1Example3" label="Remember me" defaultChecked />
                </MDBCol>
                <MDBCol>
                  <a href="#!">Forgot password?</a>
                </MDBCol>
              </MDBRow>
            </div>
            <MDBBtn type="submit" block>
              Sign in
            </MDBBtn>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </MDBBtnGroup>
    </div>
  );
}

export default LoginForm;
