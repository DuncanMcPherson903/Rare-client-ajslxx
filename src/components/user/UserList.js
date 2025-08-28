import { getAllUsers } from "../../managers/UserManager";
import "./UserProfile.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const UserList = () => {
  const [token] = useState(localStorage.getItem("auth_token"));
  const [users, setUsers] = useState("");

  const loadUsers = () => {
    getAllUsers().then(setUsers);
  };

  useEffect(() => {
    loadUsers();
  });

  return (
    <div className="user-profile-container">
      {users && (
        <>
          {users.map((user, index) => (
            <div key={user.id || index} className="user-item-simple">
              <div className="card">
                <div className="card-content">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-128x128">
                        <img
                          className="is-rounded"
                          src={user.profileImageUrl ? user.profileImageUrl : "/images/stock-user-img.jpg"}
                          alt="Profile"
                        />
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-3">{user.username}</p>
                      <div className="buttons">
                        <Link to={token === user.id.toString() ? "/users/profile" : "/users/" + user.id} className="button is-primary is-small">{token === user.id.toString() ? "View My Profile" : "View Profile"}</Link>
                        <button className="button is-success is-small" onClick={() => console.log("Subscribe")}>Subscribe</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
