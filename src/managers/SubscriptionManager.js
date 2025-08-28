const API_URL = "http://localhost:5000";

export const getTotalSubsOfUser = (id) => {
  return fetch(`${API_URL}/subscriptions/author/${id}`).then(res => res.json());
};
