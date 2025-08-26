import { getUserById } from "../../managers/UserManager";
import "./UserProfile.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const UserView = () => {
  const [user, setUser] = useState("");
  const params = useParams();

  const loadUser = (userId) => {
    getUserById(userId).then(setUser);
  };

  useEffect(() => {
    loadUser(params.id);
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

              <div className="content">
                {user.bio}
                <br />
                <p>Creation Date: {user.createdOn.slice(0, 10)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
