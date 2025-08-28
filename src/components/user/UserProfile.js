import { getTotalSubsOfUser } from "../../managers/SubscriptionManager";
import { getUserById } from "../../managers/UserManager";
import "./UserProfile.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const UserProfile = () => {
  const [token] = useState(localStorage.getItem("auth_token"));
  const [user, setUser] = useState("");
  const [totalSubs, setTotalSubs] = useState(0);

  const loadUser = (userId) => {
    getUserById(userId).then(setUser);
  };

  const loadSubs = (userId) => {
    getTotalSubsOfUser(userId).then(setTotalSubs)
  }

  useEffect(() => {
    loadUser(token);
    loadSubs(token);
  });

  return (
    <div className="user-profile-container">
      {user && (
        <>
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
                  <p className="title is-2">{user.username}</p>
                  <p className="title is-4">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="subtitle is-6">{user.email}</p>
                </div>
              </div>

              <div className="profile-content">
                <div className="profile-content-div">
                  {user.bio}
                  <br />
                  Subscriber Count: {totalSubs}
                  <p>Creation Date: {user.createdOn.slice(0, 10)}</p>
                </div>
                <div className="profile-content-div">
                  <Link to="/MyPosts" className="button is-link">My Posts</Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
