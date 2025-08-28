import { getFormattedPostsByAuthorId } from "../../managers/PostManager";
import { useEffect, useState } from "react";

export const MyPostsList = () => {
  const [token] = useState(localStorage.getItem("auth_token"));
  const [formattedPosts, setFormattedPosts] = useState([]);

  const loadPosts = (id) => {
    getFormattedPostsByAuthorId(id).then(setFormattedPosts);
  };

  useEffect(() => {
    loadPosts(token);
  }, [token]);

  return (
    <div className="post-profile-container">
      {formattedPosts && (
        <>
          {formattedPosts.map((formattedPost, index) => (
            <div key={formattedPost.id || index} className="post-item-simple">
              <div className="card" style={{margin: "20px", border: "2px solid black"}}>
                <div className="card-header">
                  <p className="title is-2">{formattedPost.title}</p>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-128x128">
                        <img
                          src={formattedPost.imageUrl}
                          alt={formattedPost.category}
                        />
                      </figure>
                    </div>
                    <div className="my-post-content">
                      <p className="title is-4">{formattedPost.content}</p>
                    </div>
                  </div>
                </div>
                <p className="subtitle is-6">
                  Category: {formattedPost.category}
                </p>
                <footer className="card-footer">
                  <a href="#" className="card-footer-item">
                    Publish
                  </a>
                  <a href="#" className="card-footer-item">
                    Edit
                  </a>
                  <a href="#" className="card-footer-item">
                    Delete
                  </a>
                </footer>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
