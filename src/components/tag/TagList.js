import "./TagList.css";
import { useEffect, useState } from "react";
import { getTags, deleteTag, editTag } from "../../managers/TagManager";

export const TagList = () => {
  const [tags, setTags] = useState([]);

  // Load all tags
  const loadTags = () => {
    getTags().then(setTags);
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleEdit = (tagId) => {
    editTag(tagId).then((result) => {
      // Only reload tags if the edit was successful (not cancelled)
      if (result !== null) {
        loadTags();
      }
    });
  };

  return (
    <div className="tag-list-container">
      <div className="tag-header">
        <h2>All Tags</h2>
        <p>Total: {tags.length} tags</p>
      </div>

      <div className="tag-list-simple">
        {tags.map((tag, index) => (
          <div key={tag.id || index} className="tag-item-simple">
            <span>{tag.label || tag.name || `Tag ${index + 1}`}</span>
            <button
              className="edit-button"
              onClick={() => handleEdit(tag.id)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() =>
                deleteTag(tag.id).then(() => {
                  loadTags();
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