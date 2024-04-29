import HeroSection from './components/Herosection';
import Navbar from './components/Navbar';
import EventSection from './components/Eventsection';
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.css';
import About from './components/About';

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <EventSection />
      <About />
      <Footer />
    </div>
  );
}

export default App;
