import "./post.css";
import { useEffect, useState } from "react";
import { getPosts, editPost } from "../../managers/PostManager";
import { getPostTags } from "../../managers/TagManager";
import { ManageTags } from "../tag/ManageTags";
import { useNavigate } from "react-router-dom";

export const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState('');
    const [showManageTags, setShowManageTags] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [postTags, setPostTags] = useState({});
    const [sortBy, setSortBy] = useState("");
    const navigate = useNavigate();

    const loadPostTags = async (posts) => {
        try {
            const tagsPromises = posts.map(async (post) => {
                try {
                    const tags = await getPostTags(post.id);
                    return { postId: post.id, tags };
                } catch (error) {
                    console.error(`Error loading tags for post ${post.id}:`, error);
                    return { postId: post.id, tags: [] };
                }
            });
            
            const tagResults = await Promise.all(tagsPromises);
            const tagsMap = {};
            tagResults.forEach(({ postId, tags }) => {
                tagsMap[postId] = tags;
            });
            setPostTags(tagsMap);
        } catch (error) {
            console.error('Error loading post tags:', error);
        }
    };

    const loadPosts = () => {
        getPosts().then(posts => {
            setPosts(posts);
            loadPostTags(posts);
        });
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            fetch(`http://localhost:5000/posts/search?q=${encodeURIComponent(query)}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    setPosts(data);
                    loadPostTags(data);
                })
                .catch(error => {
                    console.error('Search failed:', error);
                });
        } else {
            loadPosts();
        }
    };

    const handleManageTags = (postId) => {
        setSelectedPostId(postId);
        setShowManageTags(true);
    };

    const handleTagsSaved = () => {
        loadPosts();
        setShowManageTags(false);
    };

    const sortPosts = (posts, sortOption) => {
        if (!sortOption) return posts; 

        return [...posts].sort((a, b) => {
            if (sortOption === "user") {
                const aUserId = a.user_id || a.userId || 0;
                const bUserId = b.user_id || b.userId || 0;
                return aUserId - bUserId;
            } else if (sortOption === "category") {
                const aCategoryId = a.category_id || a.categoryId || 0;
                const bCategoryId = b.category_id || b.categoryId || 0;
                return aCategoryId - bCategoryId;
            } else if (sortOption === "date") {
                const aDate = a.publication_date || a.publicationDate || "1970-01-01";
                const bDate = b.publication_date || b.publicationDate || "1970-01-01";
                return new Date(bDate) - new Date(aDate);
            } else if (sortOption === "author") {
                const aUserId = a.user_id || a.userId || 0;
                const bUserId = b.user_id || b.userId || 0;
                return aUserId - bUserId;
            }
            return 0;
        });
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <div className="post-list-container">
            <div className="post-header-text">All Posts</div>
            <div className="post-header">
                <p>Refreshed: {new Date().toLocaleDateString()}</p>
            </div>

            <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ 
                        padding: '8px', 
                        marginRight: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ddd',
                        width: '200px'
                    }}
                />
                <button type="submit" style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    Search
                </button>
            </form>

            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="sort-select" style={{ marginRight: '8px' }}>Sort by:</label>
                <select 
                    id="sort-select"
                    value={sortBy} 
                    onChange={handleSortChange}
                    style={{ 
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}
                >
                    <option value="">-- Select Sort Option --</option>
                    <option value="date">Date (Newest First)</option>
                    <option value="user">User ID</option>
                    <option value="category">Category ID</option>
                    <option value="author">Author ID</option>
                </select>
            </div>

            <ul className="post-list-content">
                {sortPosts(posts, sortBy).map((post, index) => (
                    <li key={post.id || index} className="post-item-simple">
                        <div className="post-details">
                            <h3 className="post-title">{post.title}</h3>
                            <p className="post-content">{post.content}</p>
                            <p className="post-meta">By: {post.user?.first_name} {post.user?.last_name} | Date: {post.publication_date}</p>
                            
                            {postTags[post.id] && postTags[post.id].length > 0 && (
                                <div className="post-tags">
                                    <strong>Tags: </strong>
                                    {postTags[post.id].map((tag) => (
                                        <span key={tag.id} className="tag-badge">
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            <div className="post-button-container">
                                <button 
                                    className="manage-tags-button"
                                    onClick={() => handleManageTags(post.id)}
                                >
                                    Manage Tags
                                </button>
                                
                                <button 
                                    className="details-button"
                                    onClick={() => navigate("/posts/details", { state: { post } })}
                                >
                                    Details
                                </button>
                                
                                <button 
                                    className="view-comments-button"
                                    onClick={() => navigate(`/posts/${post.id}/comments`)}
                                >
                                    View Comments
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            
            {showManageTags && (
                <ManageTags 
                    postId={selectedPostId}
                    onClose={() => setShowManageTags(false)}
                    onTagsSaved={handleTagsSaved}
                />
            )}
        </div>
    );
};
