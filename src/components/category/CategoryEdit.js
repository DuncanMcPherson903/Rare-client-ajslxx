import { useState } from "react";

export const CategoryEdit = ({ category, onSave, onCancel }) => {
    const [editedCategory, setEditedCategory] = useState({ label: category?.label || "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSave(editedCategory);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="category-edit-container">
            <div className="category-edit-header">
                <h2>Edit Category</h2>
            </div>

            <form onSubmit={handleSubmit} className="category-edit-form">
                <div className="form-group">
                    <label htmlFor="categoryLabel">Category Label:</label>
                    <input
                        type="text"
                        id="categoryLabel"
                        value={editedCategory.label}
                        onChange={(e) => setEditedCategory({ ...editedCategory, label: e.target.value })}
                        placeholder="Enter category label"
                    />
                </div>

                <div className="form-buttons">
                    <button type="submit" className="save-button">
                        Save Changes
                    </button>
                    <button type="button" onClick={handleCancel} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
