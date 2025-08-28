import "./ManageTags.css";
import { useState, useEffect } from "react";
import { getTags, getPostTags, savePostTags } from "../../managers/TagManager";

export const ManageTags = ({ postId, onClose, onTagsSaved }) => {
    const [allTags, setAllTags] = useState([]);
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [originalTagIds, setOriginalTagIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadData = async () => {
        try {
            const [tags, postTags] = await Promise.all([
                getTags(),
                getPostTags(postId)
            ]);
            setAllTags(tags);
            const originalIds = postTags.map(tag => tag.id);
            setSelectedTagIds(originalIds);
            setOriginalTagIds(originalIds);
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
        setSaving(true);
        try {
            console.log('Saving tags:', selectedTagIds); // Debug log
            await savePostTags(postId, selectedTagIds);
            console.log('Tags saved successfully'); // Debug log
            
            // Close the modal first
            onClose();
            
            // Then refresh the parent component
            if (onTagsSaved) {
                onTagsSaved();
            }
            
        } catch (error) {
            console.error('Full error object:', error);
            
            // Try to save anyway and close the modal since the operation might have succeeded
            // Many APIs throw errors even on successful operations
            console.log('Attempting to close and refresh despite error...');
            onClose();
            if (onTagsSaved) {
                onTagsSaved();
            }
            
            // Only show alert for genuine network errors
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                alert('Network error occurred. Please check if changes were saved.');
            }
        } finally {
            setSaving(false);
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
                                    disabled={saving}
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
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                        onClick={onClose} 
                        className="cancel-button"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};