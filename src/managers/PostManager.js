const API_URL = "http://localhost:5000"; // backend

export const getPosts = () => {
  return fetch(`${API_URL}/posts`).then(res => res.json());
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

export const searchPosts = (query) => {
    return fetch(`http://localhost:5000/posts/search?q=${encodeURIComponent(query)}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        });
};

// Post Header Image Functions
export const updatePostHeaderImage = (postId, imageData, fileName, contentType) => {
  return fetch(`${API_URL}/posts/${postId}/header-image`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      imageData,
      fileName,
      contentType
    })
  }).then(res => res.json());
};

export const getPostHeaderImage = (postId) => {
  return fetch(`${API_URL}/posts/${postId}/header-image`)
    .then(res => res.text());
};

export const deletePostHeaderImage = (postId) => {
  return fetch(`${API_URL}/posts/${postId}/header-image`, {
    method: "DELETE"
  }).then(res => res.json());
};

// Add this function for getting posts by tag
export const getPostsByTag = (tagId) => {
  return fetch(`${API_URL}/posts/tag/${tagId}`).then(res => res.json());
};