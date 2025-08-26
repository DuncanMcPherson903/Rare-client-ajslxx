const API_URL = "http://localhost:5000"; // backend

// Get all available reactions
export const getReactions = () => {
  return fetch(`${API_URL}/reactions`).then(res => res.json());
};

// Get reactions for a specific post with counts
export const getPostReactions = (postId) => {
  return fetch(`${API_URL}/posts/${postId}/reactions`).then(res => res.json());
};

// Add a user's reaction to a post
export const addReaction = (postId, reactionId, userId) => {
  return fetch(`${API_URL}/posts/${postId}/reactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      postId: postId,
      reactionId: reactionId, 
      userId: userId 
    }),
  }).then(res => res.json());
};

// Remove a user's reaction from a post
export const removeReaction = (postId, reactionId, userId) => {
  return fetch(`${API_URL}/posts/${postId}/reactions/${reactionId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userId }),
  });
};

// Get user's reactions for a specific post
export const getUserPostReactions = (postId, userId) => {
  return fetch(`${API_URL}/posts/${postId}/reactions/user/${userId}`).then(res => res.json());
};
