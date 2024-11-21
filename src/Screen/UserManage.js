import React, { useEffect, useState } from "react";
import "../Screen/UserManage.css";
import star from "../assets/images/star.png"

const UserInfoCard = ({ user, showStar }) => {

  const hiddenPassword = "*".repeat(user.password.length);
  return (
    <div className="user-card">
      <div className="title-container">
      <h2 className="text">{user.name}</h2>
      {showStar && <img className="star-icon" src={star} alt="star"/>} 
      </div>
      
      <p className="text">
        Email:{" "}
        <a href="#email" className="emailText">
          {user.email}
        </a>{" "}
      </p>
      <p className="text">Mật khẩu: {hiddenPassword}</p>
      <div className="bottomUserCard">
        <p className="text">SDT: {user.phone}</p>
        <p className="date">
          Ngày tạo:{" "}
          <span className="dateN">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </p>
      </div>
      <hr />
    </div>
  );
};

function UserManage() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getNewUsers = async () => {
      const response = await fetch("http://localhost:6677/users/get-NewUsers");
      const result = await response.json();
      console.log(result.data);
      setUsers(result.data);
    };
    getNewUsers();
    return () => {};
  }, []);


  const [oldusers, setOldUsers] = useState([]);
  useEffect(() => {
    const getOldUsers = async () => {
      const response2 = await fetch("http://localhost:6677/users/get-OdlUsers");
      const result2 = await response2.json();
      console.log(result2.data);
      setOldUsers(result2.data);
    };
    getOldUsers();
    return () => {};
  }, []);


  return (
    <div className="container">
      <div className="table1-container">
        <h2 className="nameU">Người dùng mới</h2>
        <div className="user-list">
          {users.length > 0 &&
            users.map((user, index) => {
              return (
                <UserInfoCard
                  className="userInfoCard "
                  key={index}
                  user={user}
                  showStar={false}
                />
              );
            })}
        </div>
      </div>
      <div className="table1-container">
        <h2 className="nameU">Người dùng trên 3 tháng</h2>
        <div className="user-list">
          {oldusers.length > 0 &&
            oldusers.map((user, index) => {
              return (
                <UserInfoCard
                  className="userInfoCard "
                  key={index}
                  user={user}
                  showStar={true}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default UserManage;
