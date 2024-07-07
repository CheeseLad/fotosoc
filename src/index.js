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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
