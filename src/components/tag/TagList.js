// List all tags
import "./TagList.css"
import { useEffect, useState } from "react"
import { getTags } from "../../services/TagManager"

export const TagList = () => {
    const [tags, setTags] = useState([])

    useEffect(() => {
        getTags().then(setTags)
    }, [])

    return (
        <div className="tag-list-container">
            <div className="tag-header">
                <h2>All Tags</h2>
                <p>Total: {tags.length} tags</p>
            </div>
            
            <div className="tag-list-simple">
                {tags.map((tag, index) => (
                    <div key={tag.id || index} className="tag-item-simple">
                        {tag.label || tag.name || `Tag ${index + 1}`}
                    </div>
                ))}
            </div>
        </div>
    )
}