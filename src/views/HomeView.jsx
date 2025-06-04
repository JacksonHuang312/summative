import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./HomeView.css";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Featured from "../components/Featured";
import Footer from "../components/Footer";

function HomeView() {
  return (
    <div>
      <Header />
      <Hero />
      <Featured />
      <Footer />
    </div>
  );
}

export default HomeView;