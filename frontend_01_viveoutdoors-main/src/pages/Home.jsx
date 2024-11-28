//import React from "react";
//import CustomNavbar from "../components/Navbar";
import CarouselComponent from "../components/CarouselComponent";
import CategoryCards from "../components/CategoryCards";
import FeaturedProducts from "../components/FeaturedProducts";
import BrandBanner from "../components/BrandBanner";
import Suscripcion from "../components/Suscripcion";

const Home = () => {
  return (
    <div>
      <h1>Bienvenido a nuestro Marketplace</h1>
      <CarouselComponent />
      <CategoryCards />
      <FeaturedProducts />
      <BrandBanner />
      <Suscripcion />
    </div>
  );
};

export default Home;

// cambio en el home para probar push
