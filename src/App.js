import HeroSection from './components/Herosection';
import Navbar from './components/Navbar';
import EventSection from './components/Eventsection';
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.css';
import About from './components/About';
import FotoOfTheWeek from './components/FotoOfTheWeek';
import WhatOurMembersSay from './components/WhatOurMembersSay';
import WhatWeDo from './components/WhatWeDo';

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
      <Footer />
    </div>
  );
}

export default App;
