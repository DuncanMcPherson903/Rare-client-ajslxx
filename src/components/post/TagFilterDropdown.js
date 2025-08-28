import { useEffect, useState } from "react";
import { getTags } from "../../managers/TagManager";
import "./post.css";

export const TagFilterDropdown = ({ onTagSelect, selectedTagId }) => {
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        getTags().then(setAllTags);
    }, []);

    const handleTagChange = (e) => {
        const tagId = e.target.value;
        onTagSelect(tagId); // Pass the selected tag ID back to parent
    };

    return (
        <>
            <label htmlFor="sort-select">Filter by Tag:</label>
            <select 
                id="sort-select"
                value={selectedTagId} 
                onChange={handleTagChange}
                className="sort-select"
            >
                <option value="">-- All Posts --</option>
                {allTags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                        {tag.label}
                    </option>
                ))}
            </select>
        </>
    );
};