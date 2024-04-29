import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Committee from './components/Committee';
import GalleryTitle from './components/GalleryTitle';

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
        <Route path="/gallery" element={
        <div>
          <Navbar />
          <GalleryTitle />
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
