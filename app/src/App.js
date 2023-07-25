import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './routes/home/Home'
import { Country } from './routes/country/Country'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:code" element={<Country/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
