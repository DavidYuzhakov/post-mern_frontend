import { useEffect } from "react";
import Container from "@mui/material/Container";
import { Route, Routes } from "react-router-dom";

import { Header, ModalAlert } from "./components/";
import { Home, FullPost, Registration, AddPost, Login, NotFound, Tags } from "./pages";
import { useLazyFetchAuthMeQuery } from "./store/services/PostService";

function App() {
  const [fetchAuthMe] = useLazyFetchAuthMeQuery()

  useEffect(() => {
    (async function () {
      await fetchAuthMe(null)
    }())
  }, [])

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/tags/:tag" element={<Tags />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <ModalAlert />
    </>
  );
}

export default App;
