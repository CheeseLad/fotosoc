import HeroSection from './components/home/Herosection';
import Navbar from './components/navigation/Navbar';
import EventSection from './components/home/Eventsection';
import Footer from './components/navigation/Footer';
import '@fortawesome/fontawesome-free/css/all.css';
import About from './components/home/About';
import FotoOfTheWeek from './components/home/FotoOfTheWeek';
import WhatWeDo from './components/home/WhatWeDo';
import Stats from './components/home/Stats';
import ContinuousScrollZoom from './components/home/ContinuousScrollZoom';
import RandomPortfolios from './components/portfolio/RandomPortfolios';

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <EventSection />
      <About />
      <RandomPortfolios />
      <FotoOfTheWeek />
      <WhatWeDo />
      <Stats />
      <ContinuousScrollZoom />
      <Footer />
    </div>
  );
}

export default App;
