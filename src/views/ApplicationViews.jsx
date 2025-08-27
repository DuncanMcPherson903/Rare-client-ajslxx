import { Route, Routes } from "react-router-dom"
import { Login } from "../components/auth/Login"
import { Register } from "../components/auth/Register"
import { Authorized } from "./Authorized"
import { TagList } from "../components/tag/TagList"
import { TagCreate } from "../components/tag/TagCreate"
import { CategoryList } from "../components/category/CategoryList"
import { CategoryCreate } from "../components/category/CategoryCreate"
import { PostList } from "../components/post/post"
import { PostDetail } from "../components/post/PostDetail"
import { PostEdit } from "../components/post/PostEdit"
import { CommentList } from "../components/comments/CommentList"
import { CommentCreate } from "../components/comments/CommentCreate"
import { ReactionList } from "../components/reaction/ReactionList"
import { UserProfile } from "../components/user/UserProfile"

export const ApplicationViews = ({ token, setToken }) => {
  return <>
    <Routes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/login" element={<Login setToken={setToken} />}  />
      <Route path="/register" element={<Register setToken={setToken} />}  />
      
      {/* Temporarily moved outside Authorized for testing without auth */}
      <Route path="/tags" element={<TagList />} />
      <Route path="/tags/create" element={<TagCreate />} />
      <Route path="/categories" element={<CategoryList />} />
      <Route path="/categories/create" element={<CategoryCreate />} />
      <Route path="/posts" element={<PostList />} />
      <Route path="/posts/:postId" element={<PostDetail />} />
      <Route path="/posts/:postId/edit" element={<PostEdit />} />
      <Route path="/posts/:postId/comments" element={<CommentList showDetails={true} />} />
      <Route path="/comments" element={<CommentList />} />
      <Route path="/comments/create" element={<CommentCreate />} />
      <Route path="/reactions" element={<ReactionList />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route element={<Authorized token={token} />}>
        {/* Add Routes here */}
        {/* Tag routes moved above for now */}
      </Route>
    </Routes>
  </>
}
