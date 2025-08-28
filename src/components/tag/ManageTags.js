import "./ManageTags.css";
import { useState, useEffect } from "react";
import { getTags, getPostTags, savePostTags } from "../../managers/TagManager";

export const ManageTags = ({ postId, onClose, onSave }) => {
    const [allTags, setAllTags] = useState([]);
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [originalTagIds, setOriginalTagIds] = useState([]); // Track original tags
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [tags, postTags] = await Promise.all([
                getTags(),
                getPostTags(postId)
            ]);
            setAllTags(tags);
            const originalIds = postTags.map(tag => tag.id);
            setSelectedTagIds(originalIds);
            setOriginalTagIds(originalIds); // Store original state
            setLoading(false);
        } catch (error) {
            console.error('Error loading tags:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [postId]);

    const handleTagToggle = (tagId) => {
        setSelectedTagIds(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSave = async () => {
        try {
            await savePostTags(postId, selectedTagIds);
            onSave();
        } catch (error) {
            console.error('Error saving tags:', error);
            alert('Failed to save tags. Please try again.');
        }
    };

    // Helper function to determine tag status
    const getTagStatus = (tagId) => {
        const wasOriginallySelected = originalTagIds.includes(tagId);
        const isCurrentlySelected = selectedTagIds.includes(tagId);
        
        if (wasOriginallySelected && isCurrentlySelected) return 'current';
        if (wasOriginallySelected && !isCurrentlySelected) return 'removing';
        if (!wasOriginallySelected && isCurrentlySelected) return 'adding';
        return 'available';
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <p>Loading tags...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Manage Tags for Post</h2>
                <p>Select the tags you want to associate with this post:</p>
                
                <div className="tags-grid">
                    {allTags.map(tag => {
                        const status = getTagStatus(tag.id);
                        return (
                            <label key={tag.id} className={`tag-checkbox tag-${status}`}>
                                <input
                                    type="checkbox"
                                    checked={selectedTagIds.includes(tag.id)}
                                    onChange={() => handleTagToggle(tag.id)}
                                />
                                <span className="tag-label">{tag.label}</span>
                                {status === 'removing' && <span className="status-indicator removing">Will remove</span>}
                                {status === 'adding' && <span className="status-indicator adding">Will add</span>}
                                {status === 'current' && <span className="status-indicator current">Current</span>}
                            </label>
                        );
                    })}
                </div>

                <div className="changes-summary">
                    <p>
                        {selectedTagIds.length} tag(s) selected • 
                        {originalTagIds.filter(id => !selectedTagIds.includes(id)).length} will be removed • 
                        {selectedTagIds.filter(id => !originalTagIds.includes(id)).length} will be added
                    </p>
                </div>

                <div className="modal-actions">
                    <button 
                        onClick={handleSave} 
                        className="save-button"
                    >
                        Save Changes
                    </button>
                    <button 
                        onClick={onClose} 
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};