import HeroSection from './components/Herosection';
import Navbar from './components/Navbar';
import EventSection from './components/Eventsection';
import Footer from './components/Footer';
import '@fortawesome/fontawesome-free/css/all.css';

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <EventSection />
      <Footer />
    </div>
  );
}

export default App;
