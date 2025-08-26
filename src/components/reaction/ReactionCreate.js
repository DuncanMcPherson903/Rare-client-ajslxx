import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReaction } from '../../managers/ReactionManager';
import './ReactionCreate.css';

export const ReactionCreate = () => {
    const [reactionData, setReactionData] = useState({
        label: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewEmoji, setPreviewEmoji] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setReactionData(prev => ({
            ...prev,
            [name]: value
        }));

        // Update emoji preview when imageUrl changes
        if (name === 'imageUrl') {
            // Check if it's a single emoji character
            if (value.length === 1 || value.match(/[\u{1f600}-\u{1f64f}]|[\u{1f300}-\u{1f5ff}]|[\u{1f680}-\u{1f6ff}]|[\u{1f1e0}-\u{1f1ff}]|[\u{2600}-\u{26ff}]|[\u{2700}-\u{27bf}]/u)) {
                setPreviewEmoji(value);
            } else {
                setPreviewEmoji('');
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!reactionData.label.trim()) {
            setError('Label is required');
            return;
        }

        if (!reactionData.imageUrl.trim()) {
            setError('Image URL or emoji is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            await createReaction(reactionData.label, reactionData.imageUrl);
            
            // Navigate back to reactions list on success
            navigate('/reactions');
        } catch (err) {
            setError('Failed to create reaction. Please try again.');
            console.error('Error creating reaction:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/reactions');
    };

    // Common emoji suggestions
    const emojiSuggestions = ['👍', '👎', '❤️', '😂', '😮', '😢', '😠', '🎉', '🔥', '💯', '👏', '🤔'];

    const handleEmojiSelect = (emoji) => {
        setReactionData(prev => ({
            ...prev,
            imageUrl: emoji
        }));
        setPreviewEmoji(emoji);
    };

    return (
        <div className="reaction-create-container">
            <div className="reaction-create-header">
                <h2>Create New Reaction</h2>
                <p>Add a new reaction for users to express their feelings about posts</p>
            </div>

            <form onSubmit={handleSubmit} className="reaction-create-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="label">Reaction Label *</label>
                    <input
                        type="text"
                        id="label"
                        name="label"
                        value={reactionData.label}
                        onChange={handleInputChange}
                        placeholder="e.g., Like, Love, Laugh"
                        maxLength={50}
                        required
                    />
                    <small className="help-text">A descriptive name for this reaction</small>
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">Emoji or Image URL *</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={reactionData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="👍 or https://example.com/icon.png"
                        required
                    />
                    <small className="help-text">
                        Enter a single emoji character or a full URL to an image
                    </small>
                </div>

                <div className="emoji-suggestions">
                    <label>Quick Emoji Selection:</label>
                    <div className="emoji-grid">
                        {emojiSuggestions.map((emoji, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`emoji-suggestion ${reactionData.imageUrl === emoji ? 'selected' : ''}`}
                                onClick={() => handleEmojiSelect(emoji)}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="reaction-preview">
                    <label>Preview:</label>
                    <div className="preview-container">
                        {previewEmoji ? (
                            <div className="preview-emoji">{previewEmoji}</div>
                        ) : reactionData.imageUrl && reactionData.imageUrl.startsWith('http') ? (
                            <img 
                                src={reactionData.imageUrl} 
                                alt="Preview"
                                className="preview-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="preview-placeholder">
                                {reactionData.label ? reactionData.label.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}
                        <span className="preview-label">{reactionData.label || 'Reaction Label'}</span>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-cancel"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-create"
                        disabled={loading || !reactionData.label.trim() || !reactionData.imageUrl.trim()}
                    >
                        {loading ? 'Creating...' : 'Create Reaction'}
                    </button>
                </div>
            </form>
        </div>
    );
};
