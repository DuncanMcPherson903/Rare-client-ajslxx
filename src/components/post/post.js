import "./post.css";
import { useEffect, useState } from "react";
import { getPosts, editPost } from "../../managers/PostManager";
import { getPostTags } from "../../managers/TagManager";
import { ManageTags } from "../tag/ManageTags";

export const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState('');
    const [showManageTags, setShowManageTags] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [postTags, setPostTags] = useState({});

    const loadPostTags = async (posts) => {
        try {
            const tagsPromises = posts.map(async (post) => {
                const tags = await getPostTags(post.id);
                return { postId: post.id, tags };
            });
            
            const tagsResults = await Promise.all(tagsPromises);
            const tagsMap = {};
            tagsResults.forEach(({ postId, tags }) => {
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
    }, [loadPosts]);

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
                    onChange={e => setQuery(e.target.value)}
                />
                <button type="submit">
                    {query.trim() ? 'Search' : 'Show All'}
                </button>
            </form>
            
            <ul className="post-list-content">
                {posts.map((post, index) => (
                    <li key={post.id || index} className="post-item-simple">
                        <div className="post-details">
                            <h3>{post.title || `Post ${index + 1}`}</h3>
                            <div> 
                                <img 
                                    src={post.image_url} 
                                    alt="Post" 
                                    style={{maxWidth: '100px', height: 'auto'}} 
                                /> 
                            </div>
                            <div> {post.content || 'No content'}</div>
                            
                            {/* Display tags */}
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
                            
                            <div className="post-details-fine">
                                <p><strong>Author:</strong> {post.user_id}</p>
                                <p><strong>Category:</strong> {post.category_id}</p>
                                <div><strong>Date Created:</strong> {post.publication_date}</div>
                            </div> 
                        </div>
                        <div className="post-actions">
                            <button
                                className="manage-tags-button"
                                onClick={() => handleManageTags(post.id)}
                            >
                                Manage Tags
                            </button>
                            <button
                                className="edit-button"
                                onClick={() => editPost(post.id).then(() => loadPosts())}
                            >
                                View Comments
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {showManageTags && (
                <ManageTags
                    postId={selectedPostId}
                    onClose={() => setShowManageTags(false)}
                    onSave={handleTagsSaved}
                />
            )}
        </div>
    );
};