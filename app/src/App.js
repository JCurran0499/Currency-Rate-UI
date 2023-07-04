import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './routes/home/Home'
import { Country } from './routes/country/Country'
import { PageNotFound } from './routes/page-not-found/PageNotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:code" element={<Country/>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
