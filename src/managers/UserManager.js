const API_URL = "http://localhost:5000";

export const getAllUsers = () => {
  return fetch(`${API_URL}/users`).then(res => res.json());
};

export const getUserById = (id) => {
  return fetch(`${API_URL}/users/${id}`).then(res => res.json());
};
