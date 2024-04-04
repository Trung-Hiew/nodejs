/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, CardTitle, CardSubtitle, Table, Navbar, Collapse, Nav, NavItem, Row, Col, DropdownToggle, DropdownMenu, DropdownItem, Dropdown, Button } from 'reactstrap'; // Import các thành phần Reactstrap
import '../CSS/sinhvien.css'
function StudentPage({ handleLogout }) {
  const [studentInfo, setStudentInfo] = useState(null);
  const [updatedInfo, setUpdatedInfo] = useState({
    TenSV: '',
    Email: '',
    GioiTinh: '',
    NgaySinh: '',
    CCCD: '',
    SDT: '',
    DanToc: '',
    TonGiao: '',
    HDT: '',
    MaLop: '',
    NoiSinh: '',
    Nganh: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [studentClasses, setStudentClasses] = useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStudentInfo(response.data.studentInfo);
        setUpdatedInfo(response.data.studentInfo); // Khởi tạo giá trị ban đầu cho việc cập nhật
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sinh viên:', error);
      }
    };
    fetchStudentInfo();
  }, []);

  useEffect(() => {
    const fetchStudentClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/student/classes/${studentInfo.MaSV}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStudentClasses(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin lớp của sinh viên:', error);
      }
    };

    if (studentInfo) {
      fetchStudentClasses();
    }
  }, [studentInfo]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedInfo({ ...updatedInfo, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/sinhvien/${studentInfo.MaSV}`, updatedInfo, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStudentInfo(response.data); // Cập nhật thông tin sinh viên sau khi cập nhật thành công
      setIsUpdating(false); // Đặt lại trạng thái để ẩn form cập nhật
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin sinh viên:', error);
    }
  };

  const handleLogoutClick = () => {
    handleLogout(); // Gọi hàm handleLogout được truyền vào từ props
    localStorage.removeItem('token'); // Xóa token khỏi local storage khi đăng xuất
  };

  return (
    <div>
    <Navbar color="info" dark expand="md">
      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
            <a className="nav-link" href="/">Trường ....</a>
          </NavItem>
        </Nav>
        <div className="ml-auto d-flex">
          <Dropdown isOpen={dropdownOpen} toggle={toggle} >
            <DropdownToggle color="info" >
              <img
                alt="Account"
                className="rounded-circle"
                width="30"
              ></img>
            </DropdownToggle>
            <DropdownMenu >
              <DropdownItem onClick={handleLogoutClick}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Collapse>
    </Navbar>
    <Card>
      <CardBody >
        <CardTitle className="text-center mb-4 fw-bold fs-4">Thông tin sinh viên</CardTitle>
        <Row>
          <Col md="4">
            <div className="text-center mb-4">
              <img
                alt="Ảnh"
                src='https://tse4.mm.bing.net/th?id=OIP.uYz9D1jvCzQBfMcF3GrGdQHaFj&pid=Api&P=0&h=180'
                className="rounded-circle"
                width="200"
                sizes='1000'
              ></img>
            </div>
          </Col>
          <Col md="8">
            <div>
              {studentInfo && !isUpdating && (
                <div>
                  <div className="row">
                    <div className="col-md-6">
                      <p>Mã sinh viên: {studentInfo.MaSV}</p>
                      <p>Tên sinh viên: {studentInfo.TenSV}</p>
                      <p>Email: {studentInfo.Email}</p>
                      <p>Giới tính: {studentInfo.GioiTinh}</p>
                      <p>Ngày sinh: {studentInfo.NgaySinh}</p>
                      <p>CCCD: {studentInfo.CCCD}</p>
                    </div>
                    <div className="col-md-6">
                      <p>Số điện thoại: {studentInfo.SDT}</p>
                      <p>Dân tộc: {studentInfo.DanToc}</p>
                      <p>Tôn giáo: {studentInfo.TonGiao}</p>
                      <p>Mã lớp: {studentInfo.MaLop}</p>
                      <p>Nơi sinh: {studentInfo.NoiSinh}</p>
                      <p>Ngành: {studentInfo.Nganh}</p>
                    </div>
                  </div>
                  <Button color="success" onClick={() => setIsUpdating(true)}>Cập nhật</Button>
                </div>
              )}
              {isUpdating && (
                <div className="row">
                  <div className="col-md-6">
                    <form>
                      <label>Mã sinh viên: {studentInfo.MaSV}</label>
                      <div className="mb-3">
                        <label htmlFor="TenSV" className="form-label">Tên sinh viên:</label>
                        <input type="text" className="form-control" id="TenSV" name="TenSV" value={updatedInfo.TenSV} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="Email" className="form-label">Email:</label>
                        <input type="text" className="form-control" id="Email" name="Email" value={updatedInfo.Email} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="GioiTinh" className="form-label">Giới tính:</label>
                        <input type="text" className="form-control" id="GioiTinh" name="GioiTinh" value={updatedInfo.GioiTinh} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="NgaySinh" className="form-label">Ngày sinh:</label>
                        <input type="date" className="form-control" id="NgaySinh" name="NgaySinh" value={updatedInfo.NgaySinh} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="CCCD" className="form-label">CCCD:</label>
                        <input type="text" className="form-control" id="CCCD" name="CCCD" value={updatedInfo.CCCD} onChange={handleInputChange} />
                      </div>
                    </form>
                  </div>
                  <div className="col-md-6">
                    <form>
                      <div className="mb-3">
                        <label htmlFor="SDT" className="form-label">Số điện thoại:</label>
                        <input type="text" className="form-control" id="SDT" name="SDT" value={updatedInfo.SDT} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="DanToc" className="form-label">Dân tộc:</label>
                        <input type="text" className="form-control" id="DanToc" name="DanToc" value={updatedInfo.DanToc} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="TonGiao" className="form-label">Tôn giáo:</label>
                        <input type="text" className="form-control" id="TonGiao" name="TonGiao" value={updatedInfo.TonGiao} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="NoiSinh" className="form-label" >Nơi sinh:</label>
                        <input type="text" className="form-control" id="NoiSinh" name="NoiSinh" value={updatedInfo.NoiSinh} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="Nganh" className="form-label">Ngành:</label>
                        <input type="text" className="form-control" id="Nganh" name="Nganh" value={updatedInfo.Nganh} onChange={handleInputChange} />
                      </div>
                    </form>
                  </div>
                  <div className="col-md-12">
                    <button className="btn btn-success me-2" onClick={handleUpdate}>Lưu</button>
                    <button className="btn btn-secondary" onClick={() => setIsUpdating(false)}>Hủy</button>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
    {studentClasses.length > 0 && (
      <div>
        <div>
          <Card>
            <CardBody>
              <CardTitle tag="h5">Bảng điểm</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
              </CardSubtitle>
              <Table className="no-wrap mt-3 align-middle" responsive borderless>
                <thead>
                  <tr>
                    <th>Mã Lớp</th>
                    <th>Tên Lớp</th>
                    <th>Điểm Thường Kỳ</th>
                    <th>Điểm Cuối Kỳ</th>
                    <th>Điểm Tổng Kết</th>
                  </tr>
                </thead>
                <tbody>
                  {studentClasses.map((classItem, index) => (
                    <tr key={index} className="border-top">
                      <td>{classItem.MaLop}</td>
                      <td>{classItem.TenLop}</td>
                      <td>{classItem.DiemThuongKy}</td>
                      <td>{classItem.DiemCuoiKy}</td>
                      <td>{classItem.DiemTongKet}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </div>
    )}
  </div>
  
  );
}

export default StudentPage;
