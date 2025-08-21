import { useState } from "react";

export const TagEdit = ({ tag, onSave, onCancel }) => {
    const [editedTag, setEditedTag] = useState({ label: tag?.label || "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSave(editedTag);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="tag-edit-container">
            <div className="tag-edit-header">
                <h2>Edit Tag</h2>
            </div>

            <form onSubmit={handleSubmit} className="tag-edit-form">
                <div className="form-group">
                    <label htmlFor="tagLabel">Tag Label:</label>
                    <input
                        type="text"
                        id="tagLabel"
                        value={editedTag.label}
                        onChange={(e) => setEditedTag({ ...editedTag, label: e.target.value })}
                        placeholder="Enter tag label"
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