import "./post.css" ;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../managers/PostManager";
import { PostReactions } from "./PostReactions";

export const PostList = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    
    const loadPosts = () => {
        getPosts().then(setPosts);
    }

 useEffect(() => {
        loadPosts();
    }, []);

return (
    <div className="post-list-container">
            <div className="post-header-text">All Posts</div>
        <div className="post-header">
            <p>Refreshed: {new Date().toLocaleDateString()}</p>
        </div>

        <ul className="post-list-content">
            {posts.map((post, index) => (
                <li key={post.id || index} className="post-item-simple">
                    <div className="post-details">
                        <h3 
                            style={{ cursor: "pointer", color: "#007bff" }}
                            onClick={() => navigate(`/posts/${post.id}`)}
                        >
                            {post.title || `Post ${index + 1}`}
                        </h3>
                        <div> <img src={post.image_url} alt="Post" style={{maxWidth: '100px', height: 'auto'}} /></div>
                        <div> {post.content || 'No content'}</div>
                       <div className="post-details-fine">
                        <p><strong>Author:</strong> {post.user_id}</p>
                        <p><strong>Category:</strong> {post.category_id}</p>
                        <div><strong>Date Created:</strong> {post.publication_date}</div>
                       </div> 
                    </div>
                    
                    {/* Post Reactions Section */}
                    <PostReactions postId={post.id} />
                    
                    <div className="post-actions">
                        <button
                            className="edit-button"
                            onClick={() => navigate(`/posts/${post.id}/comments`)}
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