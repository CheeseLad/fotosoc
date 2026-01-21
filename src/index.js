import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./css/hover.css";
import "./css/hover.css.map";
import reportWebVitals from "./reportWebVitals";
import Navbar from "./components/navigation/Navbar";
import Footer from "./components/navigation/Footer";
import Committee from "./components/Committee";
import PreviousCommittees from "./components/PreviousCommittees";
import NotFound from "./components/NotFound";
import MemberPortfolio from "./components/portfolio/MemberPortfolio";
import Contact from "./components/Contact";
import Workshops from "./components/Workshops";
import Linktree from "./components/Linktree";
import AddMemberPortfolioForm from "./components/portfolio/AddMemberPortfolioForm";
import Register from "./components/user/Register";
import Login from "./components/user/Login";
import ResetPassword from "./components/user/ResetPassword";
import AdminGalleryForm from "./components/user/AdminGalleryForm";
import MemberGallery from "./components/user/AdminGallery";
import GalleryHomepage from "./components/gallery/GalleryHomepage";
import CaptionDashboard from "./components/gallery/CaptionDashboard";
import MemberPortfoliosGrid from "./components/portfolio/MemberPortfolioGrid";
import EditMemberPortfolioForm from "./components/portfolio/EditMemberPortfolioForm";
import HeroSection from "./components/home/HeroSection";
import EventSection from "./components/home/EventSection";
import About from "./components/home/About";
import RandomPortfolios from "./components/portfolio/RandomPortfolios";
import FotoOfTheWeek from "./components/home/FotoOfTheWeek";
import WhatWeDo from "./components/home/WhatWeDo";
import Stats from "./components/home/Stats";
import ContinuousScrollZoom from "./components/home/ContinuousScrollZoom";
import LoanBooking from "./components/loans/LoanBooking";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
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
          }
        />
        <Route
          path="/committee"
          element={
            <div>
              <Navbar />
              <Committee />
              <Footer />
            </div>
          }
        />
        <Route
          path="/previous-committees"
          element={
            <div>
              <Navbar />
              <PreviousCommittees />
              <Footer />
            </div>
          }
        />
        <Route
          path="/gallery"
          element={
            <div>
              <Navbar />
              <GalleryHomepage />
              <Footer />
            </div>
          }
        />
        <Route
          path="/caption-dashboard"
          element={
            <div>
              <Navbar />
              <CaptionDashboard />
              <Footer />
            </div>
          }
        />
        <Route
          path="/loans"
          element={
            <div>
              <Navbar />
              <LoanBooking />
              <Footer />
            </div>
          }
        /> 
        <Route
          path="/portfolios/:portfolioLink"
          element={
            <div>
              <Navbar />
              <MemberPortfolio />
              <Footer />
            </div>
          }
        />
                <Route
          path="/portfolios"
          element={
            <div>
              <Navbar />
              <MemberPortfoliosGrid />
              <Footer />
            </div>
          }
        />
        <Route
          path="/gallery/:portfolioLink"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <MemberGallery />
              <Footer />
            </div>
          }
        />
                <Route
          path="/edit-portfolio/:portfolioLink"
          element={
            <div>
              <Navbar />
              <EditMemberPortfolioForm />
              <Footer />
            </div>
          }
        />
        <Route
          path="/contact"
          element={
            <div>
              <Navbar />
              <Contact />
              <Footer />
            </div>
          }
        />
        <Route
          path="/workshops"
          element={
            <div>
              <Navbar />
              <Workshops />
              <Footer />
            </div>
          }
        />
        <Route
          path="/links"
          element={
            <div>
              <Navbar />
              <Linktree sheetUrl="https://docs.google.com/spreadsheets/d/1wg9BP2UXPw2eCz8QURDj2BO2Pyle2zg4Tcj-hX7MM9U/edit" />
              <Footer />
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div>
              <Navbar />
              <NotFound />
              <Footer />
            </div>
          }
        />
        <Route
          path="/create-portfolio"
          element={
            <div>
              <Navbar />
              <AddMemberPortfolioForm />
              <Footer />
            </div>
          }
        />
        <Route
          path="/create-gallery"
          element={
            <div>
              <Navbar />
              <AdminGalleryForm />
              <Footer />
            </div>
          }
        />
        <Route
          path="/edit-gallery/:link"
          element={
            <div>
              <Navbar />
              <AdminGalleryForm />
              <Footer />
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div>
              <Navbar />
              <Register />
              <Footer />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div>
              <Navbar />
              <Login />
              <Footer />
            </div>
          }
        />
        <Route
          path="/reset-password"
          element={
            <div>
              <Navbar />
              <ResetPassword />
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
