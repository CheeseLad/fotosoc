import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './css/hover.css';
import './css/hover.css.map';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Committee from './components/Committee';
import Store from './components/Store';
import Gallery from './components/Gallery';
import GalleryExhibition2024 from './components/GalleryExhibition2024';
import PreviousCommittees from './components/PreviousCommittees';
import GalleryRemixer2024 from './components/GalleryRemixer2024';
import Loans from './components/Loans';
import GalleryFOTW from './components/GalleryFOTW';
import NotFound from './components/NotFound';
import MemberPortfolio from './components/MemberPortfolio';
import Contact from './components/Contact';
import Workshops from './components/Workshops';
import Linktree from './components/Linktree';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
        <div>
          <App />
          </div>
        } />
        <Route path="/committee" element={
        <div>
          <Navbar />
          <Committee  />
          <Footer />
        </div>
        } />
        <Route path="/previous-committees" element={
        <div>
          <Navbar />
          <PreviousCommittees />
          <Footer />
        </div>
        } />
        <Route path="/gallery" element={
        <div>
          <Navbar />
          <Gallery title="Gallery" path="../images/gallery" />
          <Footer />
        </div>
        } />
        <Route path="/gallery/exhibition-2024" element={
        <div>
          <Navbar />
          <GalleryExhibition2024 />
          <Footer />
        </div>
        } />
        <Route path="/gallery/remixer-2024" element={
        <div>
          <Navbar />
          <GalleryRemixer2024 />
          <Footer />
        </div>
        } />
        <Route path="/gallery/foto-of-the-week-winners" element={
        <div>
          <Navbar />
          <GalleryFOTW />
          <Footer />
        </div>
        } />
        <Route path="/store" element={
        <div>
          <Navbar />
          <Store />
          <Footer />
        </div>
        } />
        <Route path="/loans" element={
        <div>
          <Navbar />
          <Loans />
          <Footer />
        </div>
        } />
        <Route path="/success" element={
        <div>
          <Navbar />
          <h1>Success</h1>
          <Footer />
        </div>
        } />
        <Route path="/portfolio/jake-farrell" element={
          <div>
            <Navbar />
            <MemberPortfolio name={"Jake Farrell"} description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec interdum magna. Nam rutrum dignissim sodales. Sed nec ipsum vitae nulla tristique feugiat consequat eget ipsum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque erat ex, dignissim lobortis felis ut, tincidunt faucibus mauris. Duis eleifend, lacus vel mattis pulvinar, lacus augue faucibus quam, euismod facilisis magna orci ut ante. In iaculis magna in dui mollis lobortis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi convallis accumsan vehicula. "} />
            <Footer />
          </div>
        } />
        <Route path="/contact" element={
        <div>
          <Navbar />
          <Contact />
          <Footer />
        </div>
        } />
        <Route path="/workshops" element={
        <div>
          <Navbar />
          <Workshops />
          <Footer />
        </div>
        } />
        <Route path="/links" element={
        <div>
          <Navbar />
          <Linktree />
          <Footer />
        </div>
        } />
        <Route path="*" element={ 
          <div>
            <Navbar />
            <NotFound />
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
