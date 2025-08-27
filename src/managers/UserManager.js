const API_URL = "http://localhost:5000";

export const getAllUsers = () => {
  return fetch(`${API_URL}/users`).then(res => res.json());
};

export const getUserById = (id) => {
  return fetch(`${API_URL}/users/${id}`).then(res => res.json());
};

// Profile Picture Management
export const updateProfilePicture = (userId, imageData, fileName, contentType) => {
  return fetch(`${API_URL}/users/${userId}/profile-picture`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageData: imageData,
      fileName: fileName,
      contentType: contentType
    }),
  }).then(res => res.json());
};

export const getProfilePicture = (userId) => {
  return fetch(`${API_URL}/users/${userId}/profile-picture`).then(res => {
    if (res.ok) {
      return res.text(); // Return the data URL as text
    }
    return null;
  });
};

export const deleteProfilePicture = (userId) => {
  return fetch(`${API_URL}/users/${userId}/profile-picture`, {
    method: "DELETE",
  }).then(res => res.ok);
};
