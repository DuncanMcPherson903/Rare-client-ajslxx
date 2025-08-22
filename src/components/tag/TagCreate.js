/* Tag Create Form */
import { createTag } from "../../managers/TagManager";

import { useState } from "react";
import { useNavigate } from "react-router-dom";



export const TagCreate = () => {
    const navigate = useNavigate();
    const [tag, setTag] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!tag.trim()) {
            return;
        }

        createTag({ label: tag }).then(() => {
            navigate("/tags");
        });
    };

    return (
        <div className="tag-create-form">
            <h1>Create New Tag</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="tag">Tag</label>
                    <input type="text" id="tag" value={tag} onChange={(e) => setTag(e.target.value)} />
                </div>
                <button type="submit">Create Tag</button>
            </form>
        </div>
    )
}
