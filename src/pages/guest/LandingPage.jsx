import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../../components/landing/HeroSection";
import QuoteSection from "../../components/landing/QuoteSection";
import MenuShowcaseSection from "../../components/landing/MenuShowcaseSection";
import FaqSection from "../../components/landing/FaqSection";
import TestimonialSection from "../../components/landing/TestimonialSection";

const LandingPage = () => {
  const { hash } = useLocation();

  // Link seperti "/#tentang" atau "/#kontak" -> gulir halus ke bagian itu.
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return undefined;
    }
    const t = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }, 420); // tunggu animasi pindah halaman
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <>
      <HeroSection />
      <QuoteSection />
      <MenuShowcaseSection />
      <FaqSection />
      <TestimonialSection />
    </>
  );
};

export default LandingPage;
