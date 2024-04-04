/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';


function LecturerPage({ handleLogout }) {
  const [lecturerInfo, setLecturerInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    TenGV: '',
    GioiTinh: '',
    MaKhoa: ''
  });
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    const fetchLecturerInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLecturerInfo(response.data.teacherInfo);
        setUpdatedInfo(response.data.teacherInfo);
        const classResponse = await axios.get(`http://localhost:5000/lophoc/${response.data.teacherInfo.MaGV}/classes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClassList(classResponse.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin giảng viên:', error);
      }
    };
    fetchLecturerInfo();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      handleClassChange(selectedClass);
    }
  }, [selectedClass]);

  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    try {
      const token = localStorage.getItem('token');
      const studentResponse = await axios.get(`http://localhost:5000/lophoc/${classId}/students`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStudentList(studentResponse.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
    }
  };

  const handleStudentClick = (studentId) => {
    const selectedStudent = studentList.find(student => student.MaSV === studentId);
    // Xử lý khi người dùng click vào sinh viên
  };

  const handleInputChange = (e) => {
    setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/giangvien/${lecturerInfo.MaGV}`, updatedInfo, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedResponse = await axios.get(`http://localhost:5000/giangvien/${lecturerInfo.MaGV}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLecturerInfo(updatedResponse.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin giảng viên:', error);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
  };

  const handleScoreChange = (studentId, scoreField, newScore) => {
    // Xử lý khi điểm được thay đổi
    setStudentList(studentList.map(student => {
      if (student.MaSV === studentId) {
        // Nếu điểm mới khác với điểm hiện tại của sinh viên
        if (newScore !== student[scoreField]) {
          return { ...student, [scoreField]: newScore };
        }
      }
      return student;
    }));
  };

  const handleScoreEditClick = (studentId, scoreField) => {
    console.log(`Đã click vào ô điểm của sinh viên ${studentId}, trường điểm: ${scoreField}`);
    // Thực hiện các hành động bạn muốn khi click vào ô điểm
  };

  const handleSaveScore = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      // Tìm sinh viên trong danh sách sinh viên
      const studentToUpdate = studentList.find(student => student.MaSV === studentId);
      if (studentToUpdate) {
        await axios.put(`http://localhost:5000/lophoc/${selectedClass}/students/${studentId}/scores`, studentToUpdate, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Lỗi khi lưu điểm cho sinh viên:', error);
    }
  };

  return (
    <div>
    <div>
        <button onClick={handleLogoutClick}>Đăng xuất</button>
    </div>
    
    <div>
        <div>
            <div>
                {lecturerInfo && !isEditing && (
                    <div>
                        <p>Mã giảng viên: {lecturerInfo.MaGV}</p>
                        <p>Tên giảng viên: {lecturerInfo.TenGV}</p>
                        <p>Giới tính: {lecturerInfo.GioiTinh}</p>
                        <p>SĐT: {lecturerInfo.STD}</p>
                        <p>Email: {lecturerInfo.Email}</p>
                        <button onClick={handleEditClick}>Sửa thông tin</button>
                    </div>
                )}

                {isEditing && (
                    <div>
                        <div>
                            <label htmlFor="TenGV">Tên giảng viên:</label>
                            <input type="text" id="TenGV" name="TenGV" value={updatedInfo.TenGV} onChange={handleInputChange} placeholder="Tên giảng viên" />
                        </div>
                        <div>
                            <label htmlFor="GioiTinh">Giới tính:</label>
                            <select id="GioiTinh" name="GioiTinh" value={updatedInfo.GioiTinh} onChange={handleInputChange}>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="MaKhoa">Mã khoa:</label>
                            <input type="text" id="MaKhoa" name="MaKhoa" value={updatedInfo.MaKhoa} onChange={handleInputChange} placeholder="Mã khoa" />
                        </div>
                        <div>
                            <button onClick={handleSaveClick}>Lưu</button>
                        </div>
                    </div>
                )}

                <div>
                    <h3>Danh sách lớp học:</h3>
                    {classList.length > 0 && (
                        <select value={selectedClass} onChange={(e) => handleClassChange(e.target.value)}>
                            <option value="">Chọn lớp học</option>
                            {classList.map((classItem) => (
                                <option key={classItem.MaLop} value={classItem.MaLop}>
                                    {classItem.TenLop}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </div>
    </div>


    <div>
        <div>
            {/* Nội dung của controller */}
        </div>
        {selectedClass && (
            <div>
                <h3>Danh sách sinh viên:</h3>
                <table>
                    <thead>
                        <tr>
                        <th>Mã sinh viên</th>
                            <th>Tên sinh viên</th>
                           
                            <th>Điểm thường kỳ</th>
                            <th>Điểm cuối kỳ</th>
                            <th>Điểm tổng kết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentList.map((student) => (
                            <tr key={student.MaSV}>
                            <td>{student.MaSV}</td>
                                <td>{student.TenSV}</td>
                               
                                <td>
                                    <input
                                        type="number"
                                        value={student.DiemThuongKy}
                                        data-student-id={student.MaSV}
                                        onClick={(e) => handleScoreEditClick(student.MaSV, 'DiemThuongKy')}
                                        onChange={(e) => handleScoreChange(student.MaSV, 'DiemThuongKy', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveScore(student.MaSV)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={student.DiemCuoiKy}
                                        data-student-id={student.MaSV}
                                        onClick={(e) => handleScoreEditClick(student.MaSV, 'DiemCuoiKy')}
                                        onChange={(e) => handleScoreChange(student.MaSV, 'DiemCuoiKy', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveScore(student.MaSV)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={student.DiemTongKet}
                                        data-student-id={student.MaSV}
                                        onClick={(e) => handleScoreEditClick(student.MaSV, 'DiemTongKet')}
                                        onChange={(e) => handleScoreChange(student.MaSV, 'DiemTongKet', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveScore(student.MaSV)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>

    <div>
        {/* Footer content */}
    </div>
</div>

  );
}

export default LecturerPage;
