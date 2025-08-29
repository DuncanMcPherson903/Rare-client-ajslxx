import { useState, useEffect } from "react";
import { getReactions, getPostReactions, addReaction, removeReaction, getUserPostReactions } from "../../managers/ReactionManager";
import "./PostReactions.css";

export const PostReactions = ({ postId }) => {
    const [reactions, setReactions] = useState([]);
    const [postReactions, setPostReactions] = useState([]);
    const [userReactions, setUserReactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get current user ID from localStorage (you might want to get this from context)
    const currentUserId = parseInt(localStorage.getItem("rare_user_id") || "1");

    useEffect(() => {
        const loadReactionData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load all available reactions and post-specific reaction counts
                const [allReactions, postReactionCounts, userPostReactions] = await Promise.all([
                    getReactions(),
                    getPostReactions(postId),
                    getUserPostReactions(postId, currentUserId)
                ]);

                setReactions(allReactions || []);
                setPostReactions(postReactionCounts || []);
                setUserReactions(userPostReactions || []);
            } catch (err) {
                setError("Failed to load reactions");
                console.error("Error loading reactions:", err);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            loadReactionData();
        }
    }, [postId, currentUserId]);

    const handleReactionClick = async (reactionId) => {
        try {
            // Check if user already reacted with this reaction
            const hasReacted = userReactions.some(ur => ur.reactionId === reactionId);

            if (hasReacted) {
                // Remove reaction
                await removeReaction(postId, reactionId, currentUserId);
                setUserReactions(prev => prev.filter(ur => ur.reactionId !== reactionId));
                
                // Update post reaction counts
                setPostReactions(prev => 
                    prev.map(pr => 
                        pr.reactionId === reactionId 
                            ? { ...pr, count: Math.max(0, pr.count - 1) }
                            : pr
                    )
                );
            } else {
                // Add reaction
                await addReaction(postId, reactionId, currentUserId);
                setUserReactions(prev => [...prev, { reactionId, userId: currentUserId }]);
                
                // Update post reaction counts
                setPostReactions(prev => {
                    const existingReaction = prev.find(pr => pr.reactionId === reactionId);
                    if (existingReaction) {
                        return prev.map(pr => 
                            pr.reactionId === reactionId 
                                ? { ...pr, count: pr.count + 1 }
                                : pr
                        );
                    } else {
                        return [...prev, { reactionId, count: 1 }];
                    }
                });
            }
        } catch (err) {
            setError("Failed to update reaction");
            console.error("Error updating reaction:", err);
        }
    };

    const getReactionCount = (reactionId) => {
        const postReaction = postReactions.find(pr => pr.reactionId === reactionId);
        return postReaction ? postReaction.count : 0;
    };

    const hasUserReacted = (reactionId) => {
        return userReactions.some(ur => ur.reactionId === reactionId);
    };

    if (loading) {
        return (
            <div className="reactions-container">
                <div className="reactions-loading">Loading reactions...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reactions-container">
                <div className="reactions-error">{error}</div>
            </div>
        );
    }

    if (!reactions.length) {
        return null;
    }

    return (
        <div className="reactions-container">
            <h4 className="reactions-title">React to this post:</h4>
            <div className="reactions-list">
                {reactions.map(reaction => {
                    const count = getReactionCount(reaction.id);
                    const userHasReacted = hasUserReacted(reaction.id);
                    
                    return (
                        <div 
                            key={reaction.id} 
                            className={`reaction-item ${userHasReacted ? 'user-reacted' : ''}`}
                            onClick={() => handleReactionClick(reaction.id)}
                        >
                            <div className="reaction-image-container">
                                {reaction.imageUrl ? (
                                    reaction.imageUrl.startsWith('http') ? (
                                        <img 
                                            src={reaction.imageUrl} 
                                            alt={reaction.label}
                                            className="reaction-image"
                                        />
                                    ) : (
                                        <div className="reaction-emoji">
                                            {reaction.imageUrl}
                                        </div>
                                    )
                                ) : (
                                    <div className="reaction-placeholder">
                                        {reaction.label.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {count > 0 && (
                                    <span className="reaction-count">{count}</span>
                                )}
                            </div>
                            <span className="reaction-label">{reaction.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
