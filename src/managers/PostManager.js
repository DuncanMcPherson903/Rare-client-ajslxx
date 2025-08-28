const API_URL = "http://localhost:5000"; // backend

export const getPosts = () => {
  return fetch(`${API_URL}/posts`).then(res => res.json());
};

export const getPostsByAuthorId = (id) => {
  return fetch(`${API_URL}/posts/author/${id}`).then(res => res.json());
};

export const getFormattedPostsByAuthorId = (id) => {
  return fetch(`${API_URL}/posts/author/format/${id}`).then(res => res.json());
};

export const deletePost = (id) => {
  return fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE"
  });
};

export const createPost = (postData) => {
  return fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  }).then(res => res.json());
};

export const editPost = (postId) => {
  const newLabel = prompt("Enter new post label:");
  if (newLabel) {
    return fetch(`${API_URL}/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ label: newLabel })
    });
  }
};
