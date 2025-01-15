import { Annotations } from '../../components/annotations/Annotations'
import { Title } from '../../components/title/Title'
import { CurrencyRates } from '../../components/currency_rates/CurrencyRates';
import { makeRequest } from '../../util/services'
import { useState, useEffect } from 'react'
import './Home.css';

export const Home = () => {
  const [display, handleDisplay] = useState(false)
  const [rates, handleRates] = useState({})

  /*
   * Retrieve latest currency data
  */
  useEffect(() => {
    makeRequest('/latest')
      .then((resp) => handleRates(resp.data))
      .then(() => handleDisplay(true))
  }, [])
  
  return (
    <div id="Home">
      {display &&
      <div>
        <Title/>
        <CurrencyRates
          rates={rates}
        />
      </div>
      }
      
      <Annotations/>
    </div>
  );
}
