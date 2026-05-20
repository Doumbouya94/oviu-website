import { Routes, Route } from "react-router-dom";
import Navbar from "../components/layouts/NavBar";

import Home from "../features/home/Home";
import About from "../features/about-us/About";
import Products from "../features/products-page/Products";
import Gallery from "../features/gallery-portfolio/Gallery";
import Contact from "../features/contact-us/Contact";

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      </main>
    </>
  );
};

export default AppRoutes;