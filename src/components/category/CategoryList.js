import "./CategoryList.css";
import { useEffect, useState } from "react";
import { getCategories, deleteCategory, editCategory } from "../../managers/CategoryManager";
import { Link } from "react-router-dom"

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  // Load all categorys
  const loadCategories = () => {
    getCategories().then(setCategories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (categoryId) => {
  editCategory(categoryId).then(() => {
    loadCategories();
  });
};

  return (
    <div className="category-list-container">
      <div className="category-header">
        <Link to="/categories/create" class="button is-primary is-medium">Create Category</Link>
      </div>

      <div className="category-list-simple">
        {categories.map((category, index) => (
          <div key={category.id || index} className="category-item-simple">
            <span>{category.label || category.name || `Category ${index + 1}`}</span>
            <br/>
            <button
              className="edit-button"
              onClick={() => handleEdit(category.id)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() =>
                deleteCategory(category.id).then(() => {
                  loadCategories();
                })
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
