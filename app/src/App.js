import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './routes/home/Home'
import { PageNotFound } from './routes/page-not-found/PageNotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
