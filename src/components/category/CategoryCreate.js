import "./CategoryForm.css";
import { createCategory } from "../../managers/CategoryManager";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./CategoryCreate.css";

export const CategoryCreate = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!category.trim()) {
            return;
        }

        createCategory({ label: category }).then(() => {
            navigate("/categories");
        });
    };

    return (
        <div className="category-create-form">
            <h1 className="category-header">Create New Category</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <button type="submit">Create Category</button>
            </form>
        </div>
    )
}
