import './Hero.css';
import oppenheimer2 from '../assets/oppenheimer2.jpeg';

function Hero() {
  return (
    <div className="hero-section">
      <img className="hero-image" src={oppenheimer2} />
    </div>
  );
}


export default Hero;