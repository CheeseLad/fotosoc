import HeroSection from './components/Herosection';
import Navbar from './components/Navbar';
import EventSection from './components/Eventsection';
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.css';
import About from './components/About';
import FotoOfTheWeek from './components/FotoOfTheWeek';

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <EventSection />
      <About />
      <FotoOfTheWeek />
      <Footer />
    </div>
  );
}

export default App;
