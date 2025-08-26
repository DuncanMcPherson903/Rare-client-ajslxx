const API_URL = "http://localhost:5000"; // backend

export const getComments = () => {
  return fetch(`${API_URL}/comments`).then(res => res.json());
};

export const getCommentsByPostId = (postId) => {
  return fetch(`${API_URL}/comments/post/${postId}`).then(res => res.json());
};

export const deleteComment = (id) => {
  return fetch(`${API_URL}/comments/${id}`, {
    method: "DELETE"
  }).then(res => {
    if (!res.ok) throw new Error('Delete failed');
    return res;
  });
};

export const createComment = (commentData) => {
  return fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
  }).then(res => res.json());
};

export const getCommentById = (commentId) => {
  return fetch(`${API_URL}/comments/${commentId}`).then(res => res.json());
};

export const updateComment = (commentId, commentData) => {
  return fetch(`${API_URL}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commentData)
  }).then(res => res.json());
};

export const getPostCommentsWithDetails = (postId) => {
  return fetch(`${API_URL}/posts/${postId}/comments-with-details`)
    .then(res => res.json())
    .then(data => {
      // The API returns {post: {...}, comments: [...]}
      // We need to return just the comments array
      if (data && data.comments && Array.isArray(data.comments)) {
        return data.comments;
      }
      return [];
    });
};

export const getPostWithCommentsDetails = (postId) => {
  return fetch(`${API_URL}/posts/${postId}/comments-with-details`)
    .then(res => res.json());
};

export const getPostById = (postId) => {
  return fetch(`${API_URL}/posts/${postId}`)
    .then(res => res.json());
};