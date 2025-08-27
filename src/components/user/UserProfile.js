import { getUserById } from "../../managers/UserManager";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import "./UserProfile.css";
import { useState, useEffect } from "react";

export const UserProfile = () => {
  const [token] = useState(localStorage.getItem("auth_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async (userId) => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpdate = (newImageUrl) => {
    setUser(prevUser => ({
      ...prevUser,
      profileImageUrl: newImageUrl
    }));
  };

  useEffect(() => {
    if (token) {
      loadUser(token);
    }
  }, [token]);

  return (
    <div className="user-profile-container">
      {loading ? (
        <div className="loading">Loading profile...</div>
      ) : user ? (
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
          
          <div className="card mt-4">
            <div className="card-content">
              <h3 className="title is-5">Profile Picture</h3>
              <ProfilePictureUpload 
                userId={token} 
                onProfilePictureUpdate={handleProfilePictureUpdate}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="error">User not found</div>
      )}
    </div>
  );
};
