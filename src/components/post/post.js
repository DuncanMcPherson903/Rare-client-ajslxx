import "./post.css";
import { useEffect, useState } from "react";
import { getPosts, deletePost, editPost, searchPosts } from "../../managers/PostManager";

export const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState('');

    const loadPosts = () => {
        getPosts().then(setPosts);
    }

    useEffect(() => {
        loadPosts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            // If there's a search query, perform search
            searchPosts(query)
                .then(setPosts);
        } else {
            // If query is empty, reload all posts
            loadPosts();
        }
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
                            <div className="post-details-fine">
                                <p><strong>Author:</strong> {post.user_id}</p>
                                <p><strong>Category:</strong> {post.category_id}</p>
                                <div><strong>Date Created:</strong> {post.publication_date}</div>
                            </div> 
                        </div>
                        <div className="post-actions">
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
        </div>
    )
}