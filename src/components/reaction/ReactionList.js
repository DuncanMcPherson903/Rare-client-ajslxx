import { useState, useEffect } from "react";
import { getReactions } from "../../managers/ReactionManager";
import "./ReactionList.css";

export const ReactionList = () => {
    const [reactions, setReactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadReactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const reactionsData = await getReactions();
                setReactions(reactionsData || []);
            } catch (err) {
                setError("Failed to load reactions");
                console.error("Error loading reactions:", err);
            } finally {
                setLoading(false);
            }
        };

        loadReactions();
    }, []);

    if (loading) {
        return (
            <div className="reaction-admin-container">
                <div className="loading-message">Loading reactions...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reaction-admin-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="reaction-admin-container">
            <div className="reaction-admin-header">
                <h2>Reaction Management</h2>
                <p>Manage available reactions for posts</p>
            </div>

            <div className="reaction-admin-list">
                {reactions.length === 0 ? (
                    <div className="no-reactions">No reactions available</div>
                ) : (
                    reactions.map((reaction) => (
                        <div key={reaction.id} className="reaction-admin-item">
                            <div className="reaction-admin-display">
                                <div className="reaction-admin-image">
                                    {reaction.imageUrl ? (
                                        reaction.imageUrl.startsWith('http') ? (
                                            <img 
                                                src={reaction.imageUrl} 
                                                alt={reaction.label}
                                                className="reaction-image-admin"
                                            />
                                        ) : (
                                            <div className="reaction-emoji-admin">
                                                {reaction.imageUrl}
                                            </div>
                                        )
                                    ) : (
                                        <div className="reaction-placeholder-admin">
                                            {reaction.label.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="reaction-info">
                                    <h4>{reaction.label}</h4>
                                    <p>ID: {reaction.id}</p>
                                    <p>Image: {reaction.imageUrl || 'No image'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
