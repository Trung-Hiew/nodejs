import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/admin.css';

const AdminPage = ({ handleLogout, username }) => {
  const [classData, setClassData] = useState({
    MaLop: '',
    TenLop: '',
    Sotinchi: 0,
    TenGV: '',
    MaGV: '',
    MaSV: '',
    password: ''
  });
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [classToDelete, setClassToDelete] = useState(null);

  useEffect(() => {
    fetchClasses();
    fetchAdminInfo();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/lophoc/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu các lớp:', error);
    }
  };

  const fetchAdminInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/admin/tcn', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminInfo(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin admin:', error);
    }
  };

  const handleChange = (e) => {
    setClassData({ ...classData, [e.target.name]: e.target.value });
  };

  const handleSubmitCreateClass = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/lophoc/create-class', classData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Phản hồi từ việc tạo lớp học:', response.data);
      fetchClasses();
    } catch (error) {
      console.error('Lỗi khi tạo lớp học:', error);
    }
  };

  const handleSubmitAddStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { MaLop, MaSV } = classData;
      const response = await axios.post(`http://localhost:5000/lophoc/${MaLop}/addStudent/${MaSV}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Phản hồi từ việc thêm sinh viên:', response.data);
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên vào lớp học:', error);
    }
  };

  const handleClassClick = async (classId) => {
    try {
      const response = await axios.get(`http://localhost:5000/lophoc/${classId}/students`);
      setStudents(response.data);
      setSelectedClass(classId);
      setSelectedFunction(null); // Đảm bảo reset selectedFunction
      console.log('Đã chọn lớp:', classId);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sinh viên:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    let userData = { password: classData.password };
    if (classData.MaSV) {
      userData = { ...userData, MaSV: classData.MaSV, userType: 'student' };
    } else if (classData.MaGV) {
      userData = { ...userData, MaGV: classData.MaGV, userType: 'lecturer' };
    } else {
      console.error('Mã sinh viên hoặc Mã giảng viên không được để trống');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/users', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Phản hồi từ việc tạo tài khoản:', response.data);
      alert('Tạo tài khoản thành công');
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản:', error.response);
      alert('Lỗi khi tạo tài khoản');
    }
  };

  const handleFunctionChange = (functionName) => {
    setSelectedFunction(functionName);
    setSelectedClass(null); // Reset selectedClass khi chọn một chức năng mới
    console.log('Đã chọn chức năng:', functionName);
    setStudents([]); // Reset danh sách sinh viên khi chọn một chức năng mới
  };

  const handleDeleteClass = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/lophoc/delete-class/${classToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Phản hồi từ việc xóa lớp học:', response.data);
      fetchClasses();
      setClassToDelete(null);
    } catch (error) {
      console.error('Lỗi khi xóa lớp học:', error);
    }
  };

  return (
    <div className="admin-page-layout">
      <div className='header'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>Xin chào, {adminInfo && adminInfo.username}</p>
          <button className='head button-logout' onClick={handleLogout}>Đăng xuất</button>
        </div>
      </div>
    
      <div className="sidebar-content-wrapper" key={selectedFunction}>
        <div className='sidebar'>
          <div className="select-wrapper">
            <h3>Danh Sách Lớp học </h3>
            <div>
            <select id="classSelect" onChange={(e) => handleClassClick(e.target.value)} defaultValue="">
  <option value="" disabled hidden>Chọn lớp học</option>
  {classes.map((classItem, index) => (
    <option key={index} value={classItem.MaLop}>
      {classItem.TenLop}
    </option>
  ))}
</select>
              <button onClick={() => handleFunctionChange('createClass')}>Tạo lớp học</button>
              <button onClick={() => handleFunctionChange('addStudent')}>Thêm sinh viên vào lớp học</button>
              <button onClick={() => handleFunctionChange('createUser')}>Tạo tài khoản</button>
            </div>
          </div>
        </div>
    
        <div className='content'>
          <div className='forms'>
            {selectedFunction === 'createClass' && (
              <div className='form'>
                <h3>Tạo lớp học</h3>
                <div>
                  <input type="text" name="MaLop" placeholder="Mã lớp" onChange={handleChange} />
                  <input type="text" name="TenLop" placeholder="Tên lớp" onChange={handleChange} />
                  <input type="number" name="Sotinchi" placeholder="Số tín chỉ" onChange={handleChange} />
                  <input type="text" name="TenGV" placeholder="Tên giảng viên" onChange={handleChange} />
                  <input type="text" name="MaGV" placeholder="Mã giảng viên" onChange={handleChange} />
                  <button type="submit" onClick={handleSubmitCreateClass}>Tạo lớp học</button>
                </div>
              </div>
            )}
    
            {selectedFunction === 'addStudent' && (
              <div className='form'>
                <h3>Thêm sinh viên vào lớp học</h3>
                <div>
                  <input type="text" name="MaLop" placeholder="Mã lớp" onChange={handleChange} />
                  <input type="text" name="MaSV" placeholder="Mã sinh viên" onChange={handleChange} />
                  <button type="submit" onClick={handleSubmitAddStudent}>Thêm sinh viên vào lớp học</button>
                </div>
              </div>
            )}
    
            {selectedFunction === 'createUser' && (
  <div className='form'>
    <h3>Tạo tài khoản</h3>
    <div>
      {classData.MaGV === '' && (
        <input type="text" name="MaSV" placeholder="Mã sinh viên" onChange={handleChange} />
      )}
      {classData.MaSV === '' && (
        <input type="text" name="MaGV" placeholder="Mã giảng viên" onChange={handleChange} />
      )}
      <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} />
      <button type="submit" onClick={handleCreateUser}>Tạo tài khoản</button>
    </div>
  </div>
)}
          </div>
    
          <div className='lists'>
            {selectedFunction !== 'createClass' && selectedFunction !== 'addStudent' && selectedFunction !== 'createUser' && selectedClass && (
              <div className='list'>
                {students.length > 0 ? (
                  <div>
                    <h3>{selectedClass}</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Mã Sinh Viên</th>
                          <th>Tên Sinh Viên</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
                          <tr key={index}>
                            <td>{student.MaSV}</td>
                            <td>{student.TenSV}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Xác nhận xóa lớp học */}
                    {classToDelete && (
                      <div className="delete-class-confirm">
                        <p>Bạn có chắc chắn muốn xóa lớp học này không?</p>
                        <button onClick={handleDeleteClass}>Xóa</button>
                        <button onClick={() => setClassToDelete(null)}>Hủy</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Không có sinh viên trong lớp này.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    
      <div className='footer'>
        {/* Footer content */}
      </div>
    </div>
  );
}

export default AdminPage;
