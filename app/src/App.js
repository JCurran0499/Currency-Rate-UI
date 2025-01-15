import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './routes/home/Home'
import { CountryPage } from './routes/country_page/CountryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:code" element={<CountryPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
