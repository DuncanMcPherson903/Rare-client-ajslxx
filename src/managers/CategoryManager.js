const API_URL = "http://localhost:5000"; // backend

export const getCategories = () => {
  return fetch(`${API_URL}/categories`).then(res => res.json());
};

export const deleteCategory = (id) => {
  return fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE"
  });
};

export const createCategory = (categoryData) => {
  return fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoryData),
  }).then(res => res.json());
};

export const editCategory = (categoryId) => {
  const newLabel = prompt("Enter new category label:");
  if (newLabel) {
    return fetch(`${API_URL}/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ label: newLabel })
    });
  }
};
