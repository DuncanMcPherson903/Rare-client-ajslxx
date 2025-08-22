import { Route, Routes } from "react-router-dom"
import { Login } from "../components/auth/Login"
import { Register } from "../components/auth/Register"
import { Authorized } from "./Authorized"
import { TagList } from "../components/tag/TagList"
import { TagCreate } from "../components/tag/TagCreate"
import { CommentList } from "../components/comments/CommentList"
import { CommentCreate } from "../components/comments/CommentCreate"

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
      
      <Route element={<Authorized token={token} />}>
        {/* Add Routes here */}
        {/* Tag routes moved above for now */}
      </Route>
    </Routes>
  </>
}
