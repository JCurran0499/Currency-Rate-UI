import { Annotations } from './components/annotations/Annotations'
import { Title } from './components/title/Title'
import { CurrencyRates } from './components/currency-rates/CurrencyRates';
import './App.css';

function App() {


  return (
    <div className="App">
      <Title/>
      <CurrencyRates/>
      <Annotations/>
    </div>
  );
}

export default App;
