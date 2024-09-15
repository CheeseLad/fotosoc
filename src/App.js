import HeroSection from './components/home/Herosection';
import Navbar from './components/Navbar';
import EventSection from './components/home/Eventsection';
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.css';
import About from './components/home/About';
import FotoOfTheWeek from './components/home/FotoOfTheWeek';
import WhatOurMembersSay from './components/home/WhatOurMembersSay';
import WhatWeDo from './components/home/WhatWeDo';
import Stats from './components/home/Stats';
import ContinuousScrollZoom from './components/home/ContinuousScrollZoom';

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <EventSection />
      <About />
      <WhatOurMembersSay />
      <FotoOfTheWeek />
      <WhatWeDo />
      <Stats />
      <ContinuousScrollZoom />
      <Footer />
    </div>
  );
}

export default App;
