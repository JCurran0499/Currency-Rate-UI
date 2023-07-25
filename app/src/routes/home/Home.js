import { Annotations } from '../../components/annotations/Annotations'
import { Title } from '../../components/title/Title'
import { CurrencyRates } from '../../components/currency-rates/CurrencyRates';
import './Home.css';

export const Home = () => {
  return (
    <div id="Home">
      <Title/>
      <CurrencyRates/>
      <Annotations/>
    </div>
  );
}
