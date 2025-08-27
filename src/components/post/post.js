import "./post.css";
import { useEffect, useState } from "react";
import { getPosts } from "../../managers/PostManager";
import { useNavigate } from "react-router-dom";

export const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState("");
    const navigate = useNavigate();


    const loadPosts = () => {
        getPosts().then(setPosts);
    }

    useEffect(() => {
        loadPosts();
    }, []);

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


    const sortedPosts = sortPosts(posts, sortBy);

    return (
        <div className="post-list-container">
            <div className="post-header-text">All Posts</div>
            <div className="post-header">
                <p>Refreshed: {new Date().toLocaleDateString()}</p>


                <div className="sort-container">
                    <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                    <select
                        id="sort-select"
                        value={sortBy}
                        onChange={handleSortChange}
                        className="sort-dropdown"
                    >
                        <option value="">-- Select Sort Option --</option>
                        <option value="user">User ID</option>
                        <option value="category">Category ID</option>
                        <option value="date">Publication Date</option>
                        <option value="author">Author ID</option>
                    </select>
                </div>
            </div>


            <ul className="post-list-content">
                {sortedPosts.map((post, index) => (
                    <li key={post.id || index} className="post-item-simple">
                        <div className="post-details">
                            <h3>{post.title || `Post ${index + 1}`}</h3>
                            <div> <img src={post.image_url} alt="Post" style={{ maxWidth: '100px', height: 'auto' }} /></div>
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
                                onClick={() => navigate(`/posts/${post.id}/comments`)}
                            >
                                View Comments
                            </button>
                            <button
                                className="edit-button"
                                onClick={() => navigate('/posts/details', {
                                    state: {
                                        title: post.title,
                                        imageUrl: post.image_url,
                                        postId: post.id,
                                        content: post.content,
                                        userId: post.user_id,
                                        categoryId: post.category_id,
                                        publicationDate: post.publication_date,
                                        approved: post.approved
                                    }
                                })}
                            >
                                Details
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}