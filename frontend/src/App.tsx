import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { RedirectHandler } from "./components/redirect-handler";
// import { PageNotFound } from "./components/page-not-found";
import { Home } from "./components/home";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/:shortUrl" element={<RedirectHandler />} /> */}
        {/* <Route path="/404" element={<PageNotFound />} /> */}
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </BrowserRouter>
  )
}