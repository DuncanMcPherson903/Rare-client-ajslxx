const API_URL = "http://localhost:5000"; // backend

export const getTags = () => {
  return fetch(`${API_URL}/tags`).then(res => res.json());
};

export const deleteTag = (id) => {
  return fetch(`${API_URL}/tags/${id}`, {
    method: "DELETE"
  });
};

export const createTag = (tagData) => {
  return fetch(`${API_URL}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tagData),
  }).then(res => res.json());
};

export const editTag = (tagId) => {
  const newLabel = prompt("Enter new tag label:");
  if (newLabel) {
    return fetch(`${API_URL}/tags/${tagId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ label: newLabel })
    });
  }
};