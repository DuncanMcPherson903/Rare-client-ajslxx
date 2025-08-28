import "./CategoryList.css";
import { useEffect, useState } from "react";
import { getCategories, deleteCategory, editCategory } from "../../managers/CategoryManager";
import { Link } from "react-router-dom"
import { getPosts } from "../../managers/PostManager";

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  // Load all categories
  const loadCategories = () => {
    getCategories().then(setCategories);
  };

  const checkBeforeDelete = (categoryId) => {
    let doNotDelete = false;
    getPosts().then((posts) => {
      for (let post in posts) {
        if (posts[post]['categoryId'] === categoryId) {
          window.alert('This category is currently in use')
          doNotDelete = true;
        }
      }
      return doNotDelete
    }).then((response) => {
      if (response === false) {
        console.log("Hit delete");
        deleteCategory(categoryId)
      }
    })
    loadCategories()
    // console.log(doNotDelete)
  }

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
        <Link to="/categories/create" className="button is-primary is-medium">Create Category</Link>
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
                checkBeforeDelete(category.id)
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
