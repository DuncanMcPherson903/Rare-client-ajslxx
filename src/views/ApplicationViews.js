import { Route, Routes } from "react-router-dom"
import { Login } from "../components/auth/Login"
import { Register } from "../components/auth/Register"
import { Authorized } from "./Authorized"
import { TagList } from "../components/tag/TagList"
import { TagCreate } from "../components/tag/TagCreate"
import { CommentList } from "../components/comments/CommentList"
import { CommentCreate } from "../components/comments/CommentCreate"
import { CommentDetail } from "../components/comments/CommentDetail"
import { CommentEditPage } from "../components/comments/CommentEditPage"
import { CategoryList } from "../components/category/CategoryList"
import { CategoryCreate } from "../components/category/CategoryCreate"
import { PostList } from "../components/post/post"
import { PostDetail } from "../components/post/PostDetail"
import { PostCreate } from "../components/post/PostCreate"
import { ReactionList } from "../components/reaction/ReactionList"
import { ReactionCreate } from "../components/reaction/ReactionCreate"
import { UserList } from "../components/user/UserList"
import { UserView } from "../components/user/UserView"
import { UserProfile } from "../components/user/UserProfile"
import { PostsDetails } from "../components/post/PostsDetails"


export const ApplicationViews = ({ token, setToken }) => {
  return <>
    <Routes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/login" element={<Login setToken={setToken} />}  />
      <Route path="/register" element={<Register setToken={setToken} />}  />
      {/* Temporarily moved outside Authorized for testing without auth */}
      <Route path="/tags" element={<TagList />} />
      <Route path="/tags/create" element={<TagCreate />} />
      <Route path="/comments" element={<CommentList />} />
      <Route path="/comments/create" element={<CommentCreate />} />
      <Route path="/comments/:commentId" element={<CommentDetail />} />
      <Route path="/comments/:commentId/edit" element={<CommentEditPage />} />
      <Route path="/posts/:postId/comments" element={<CommentList showDetails={true} />} />
      <Route path="/categories" element={<CategoryList />} />
      <Route path="/categories/create" element={<CategoryCreate />} />
      <Route path="/posts" element={<PostList />} />
      <Route path="/posts/:postId" element={<PostDetail />} />
      <Route path="/posts/create" element={<PostCreate />} />
      <Route path="/reactions" element={<ReactionList />} />
      <Route path="/reactions/create" element={<ReactionCreate />} />
      <Route path="/posts/create" element={<PostCreate />} />

      <Route path="/posts/details" element={<PostsDetails />} />




      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<UserView />} />
      <Route path="/users/profile" element={<UserProfile />} />

      <Route element={<Authorized token={token} />}>
        {/* Add Routes here */}
        {/* Tag routes moved above for now */}
      </Route>
    </Routes>
  </>
}
