import { Route, Routes } from "react-router-dom"
import { Login } from "../components/auth/Login"
import { Register } from "../components/auth/Register"
import { Authorized } from "./Authorized"
import { TagList } from "../components/tag/TagList"
import { TagCreate } from "../components/tag/TagCreate"
import { TagEdit } from "../components/tag/TagEdit"

export const ApplicationViews = ({ token, setToken }) => {
  return <>
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />}  />
      <Route path="/register" element={<Register setToken={setToken} />}  />
      
      {/* Temporarily moved outside Authorized for testing without auth */}
      <Route path="/tags" element={<TagList />} />
      <Route path="/tags/create" element={<TagCreate />} />
      <Route path="/tags/edit/:id" element={<TagEdit />} />
      
      <Route element={<Authorized token={token} />}>
        {/* Add Routes here */}
        {/* Tag routes moved above for now */}
      </Route>
    </Routes>
  </>
}
